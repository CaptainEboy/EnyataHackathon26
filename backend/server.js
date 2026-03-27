
const express = require('express');
// const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// --- ROBUST ENVIRONMENT LOADING ---
const rootEnvPath = path.resolve(__dirname, '../.env');
const localEnvPath = path.resolve(__dirname, '.env');

if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
} else if (fs.existsSync(localEnvPath)) {
  require('dotenv').config({ path: localEnvPath });
} else {
  require('dotenv').config();
}

const app = express();
// const prisma = new PrismaClient();
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'prod_secret_123';
const COOKIE_NAME = 'sn_auth_token';

// MTA Configuration (Mailtrap Sandbox)
const mUser = (process.env.MAILTRAP_USER || '').trim();
const mPass = (process.env.MAILTRAP_PASS || '').trim();
const isMailtrapConfigured = !!(mUser && mPass);

const mtaConfig = isMailtrapConfigured ? {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: { user: mUser, pass: mPass }
} : {
  host: process.env.MTA_HOST || '127.0.0.1',
  port: parseInt(process.env.MTA_PORT || '1025'),
  secure: false,
};

const transporter = nodemailer.createTransport(mtaConfig);

// Verify MTA Connection
transporter.verify((error) => {
  if (error) {
    console.error(`[MTA STATUS] ❌ Connection failed: ${error.message}`);
    console.error(`[MTA STATUS] ℹ️ Hint: Check your .env file for MAILTRAP_USER/PASS or ensure your local SMTP is running on port 1025.`);
  } else {
    console.log(`[MTA STATUS] ✅ Node connected to ${isMailtrapConfigured ? 'Mailtrap Sandbox' : 'Custom SMTP'} (${mtaConfig.host})`);
  }
});

// --- UTILITIES ---
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
};

// --- MIDDLEWARE ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cookieParser());

const whitelist = ['http://localhost:3000', 'http://localhost:9002', 'http://127.0.0.1:3000', 'http://127.0.0.1:9002'];
app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

app.use(express.json());

// --- AUTHENTICATION GUARD ---
const authenticate = catchAsync(async (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid session' });
  }
});

// --- INFRASTRUCTURE ROUTES ---

// 1x1 Transparent GIF Interception Engine
app.get('/t/o/:campaignId', catchAsync(async (req, res) => {
  const { campaignId } = req.params;
  
  // Log Event
  await prisma.event.create({
    data: {
      campaignId,
      type: 'OPEN',
      ip: req.ip || '0.0.0.0',
      userAgent: req.headers['user-agent'] || 'Unknown'
    }
  }).catch(() => {});

  // Increment Open Count
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { opens: { increment: 1 } }
  }).catch((err) => console.error("[INTERCEPTION ENGINE ERROR]", err));

  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': pixel.length,
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(pixel);
}));

app.post('/api/auth/signup', catchAsync(async (req, res) => {
  const { email, password, fullName, workspaceName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, fullName, workspaceName }
  });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  setAuthCookie(res, token);
  res.status(201).json({ user: { email: user.email, fullName: user.fullName } });
}));

app.post('/api/auth/login', catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  setAuthCookie(res, token);
  res.json({ user: { email: user.email, fullName: user.fullName } });
}));

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: { email: req.user.email, fullName: req.user.fullName } });
});

app.get('/api/campaigns', authenticate, catchAsync(async (req, res) => {
  const campaigns = await prisma.campaign.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(campaigns);
}));

app.post('/api/campaigns', authenticate, catchAsync(async (req, res) => {
  const { title, subject, content } = req.body;
  
  // 1. Create Campaign in DB
  const campaign = await prisma.campaign.create({
    data: { 
      userId: req.user.id, 
      title, 
      subject, 
      content, 
      status: 'Sent', 
      recipientsCount: 12845, 
      opens: 0, 
      clicks: 0, 
      bounces: 0,
      sentAt: new Date()
    }
  });

  // 2. Dispatch via MTA
  const trackingPixelUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/t/o/${campaign.id}`;
  
  transporter.sendMail({
    from: `"sendnrest Infrastructure" <infrastructure@sendnrest.com>`,
    to: req.user.email,
    subject: subject,
    html: `<div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2563eb; margin-bottom: 16px;">${title}</h2>
        <div style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${content}</div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          Sent via sendnrest infrastructure node.
        </div>
        <img src="${trackingPixelUrl}" width="1" height="1" style="display:none !important;" />
      </div>`
  }).catch(err => console.error("[MTA DISPATCH ERROR]", err));

  res.status(201).json(campaign);
}));

app.get('/api/contacts', authenticate, catchAsync(async (req, res) => {
  const contacts = await prisma.contact.findMany({ 
    where: { userId: req.user.id }, 
    orderBy: { createdAt: 'desc' } 
  });
  res.json(contacts);
}));

app.post('/api/contacts', authenticate, catchAsync(async (req, res) => {
  const { name, email, tags } = req.body;
  const contact = await prisma.contact.create({
    data: {
      userId: req.user.id,
      name,
      email,
      status: 'Subscribed',
      tags: tags || [],
    }
  });
  res.status(201).json(contact);
}));

app.get('/api/stats/summary', authenticate, catchAsync(async (req, res) => {
  const activeContacts = await prisma.contact.count({ where: { userId: req.user.id } });
  const campaignsSent = await prisma.campaign.count({ where: { userId: req.user.id, status: 'Sent' } });
  
  const stats = await prisma.campaign.aggregate({
    where: { userId: req.user.id, status: 'Sent' },
    _sum: { opens: true, clicks: true, recipientsCount: true }
  });
  
  const sumOpens = stats._sum.opens || 0;
  const sumRecipients = stats._sum.recipientsCount || 0;
  const sumClicks = stats._sum.clicks || 0;

  const avgOpenRate = sumRecipients > 0 ? `${((sumOpens / sumRecipients) * 100).toFixed(1)}%` : '0.0%';
  const avgClickRate = sumRecipients > 0 ? `${((sumClicks / sumRecipients) * 100).toFixed(1)}%` : '0.0%';

  const recentActivity = await prisma.campaign.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const engagementTrends = [
    { name: "Mon", sent: 1200, opens: 400 },
    { name: "Tue", sent: 2100, opens: 850 },
    { name: "Wed", sent: 1500, opens: 600 },
    { name: "Thu", sent: 2800, opens: 1100 },
    { name: "Fri", sent: 1800, opens: 750 },
    { name: "Sat", sent: 900, opens: 300 },
    { name: "Sun", sent: 500, opens: 150 },
  ];

  res.json({ 
    activeContacts, 
    campaignsSent, 
    avgOpenRate, 
    avgClickRate,
    recentActivity,
    engagementTrends 
  });
}));

app.post('/api/domains/verify', authenticate, (req, res) => {
  res.json({ domain: req.body.domain, verified: true });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`[INFRASTRUCTURE ENGINE] Ready on port ${PORT}`));