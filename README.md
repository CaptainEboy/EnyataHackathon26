# sendnrest Pseudo-Backend (PostgreSQL + Prisma)
# sendnrest Infrastructure Engine (PostgreSQL + Prisma 7)

This is the "Control Plane" of the sendnrest platform. It handles user authentication, domain reputation, MTA (Mail Transfer Agent) coordination, and the high-performance tracking engine.

## 🚀 Key Features for Pitching
- **MTA Dedicated IP Binding**: Supports the `localAddress` property in SMTP sockets to allow sending from specific network interfaces.
- **Event Interception Engine**: A 1x1 transparent GIF server (`/t/o/:id`) that logs email opens without external scripts.
- **DNS Simulation**: Logic to verify SPF, DKIM, and DMARC records for sending domains.
- **Transactional REST API**: A high-reliability endpoint for system-generated emails.

## 🛠 Setup for Testing
1. **Install Dependencies**:
   ```bash
   npm install express @prisma/client @prisma/config swagger-ui-express swagger-jsdoc bcryptjs jsonwebtoken helmet cors dotenv express-rate-limit nodemailer
   ```
2. **Database Migration**: Ensure `DATABASE_URL` is in your `.env` and run:
   ```bash
   npx prisma migrate dev
   ```
3. **Run Server**:
   ```bash
   node server.js
   ```

## 📖 API Documentation
Once running, visit `http://localhost:5000/api-docs` to view the full OpenAPI specification. You can use the "Authorize" button to test protected endpoints with a JWT or API Key.

### Core Endpoints:
- `POST /api/auth/signup`: Create a workspace and generate an API key.
- `GET /api/stats/summary`: Get top-level delivery metrics.
- `POST /api/transactional/send`: The developer-facing sending API.
- `GET /t/o/{campaignId}`: The infrastructure's tracking pixel.
- `GET /api/system/status`: Real-time health check of the MTA nodes.


his folder contains a conceptual, production-ready backend architecture using **Prisma ORM 7.x** and PostgreSQL.

## 🚀 Prisma 7 Setup
Prisma 7 introduces a mandatory shift in how database configurations are handled.

1. **Install Dependencies**:
   ```bash
   npm install express @prisma/client @prisma/config swagger-ui-express swagger-jsdoc bcryptjs jsonwebtoken helmet cors dotenv express-rate-limit
   ```
2. **Database URL**:
   Ensure `DATABASE_URL` is defined in your `.env` file.
3. **Generate Client**:
   ```bash
   npx prisma generate
   ```
4. **Deploy Migrations**:
   The `prisma.config.ts` file now directs Prisma CLI to the correct environment variable for migrations.
   ```bash
   npx prisma migrate dev
   ```

## 📖 API Documentation (Swagger)
The backend includes an interactive **Swagger UI** for testing endpoints:
- **URL**: `http://localhost:5000/api-docs`
- Use this interface to test Authentication, Campaign management, and Payment verification flows.

## 💳 Payment Integration Support
The backend supports a full **Interswitch Webpay** flow:
- `POST /api/payments/verify`: Called after the frontend redirect to verify the `transactionRef` and update the user's `plan`.
- `GET /api/billing/invoices`: Returns a history of successful transactions.

## 📊 Analytics & Reporting
Detailed performance data is available via:
- `GET /api/analytics/detailed`: Aggregates geographic, device, and link-tracking data.

## Folder Structure
- `prisma/schema.prisma`: Data models (no URL property).
- `prisma.config.ts`: Central configuration for Prisma CLI.
- `server.js`: Express server using `datasourceUrl` in the constructor.


This folder contains a conceptual, production-ready backend architecture using **Prisma ORM** and PostgreSQL.

## 📖 API Documentation (Swagger)
The backend now includes an interactive **Swagger UI** for testing endpoints:
- **URL**: `http://localhost:5000/api-docs`
- Use this interface to test Authentication, Campaign management, and Payment verification flows.

## 💳 Payment Integration Support
The backend now supports a full **Interswitch Webpay** flow:
- `POST /api/payments/verify`: Called after the frontend redirect to verify the `transactionRef` and update the user's `plan` in the database.
- `GET /api/billing/invoices`: Returns a history of successful transactions for the settings page.

## 📊 Analytics & Reporting
Standard summaries are supplemented by:
- `GET /api/analytics/detailed`: Aggregates geographic, device, and link-tracking data to power the dashboard charts.

## Route Mapping

| Frontend Page | Backend Endpoint | Method | Purpose |
|---------------|------------------|--------|---------|
| `/signup` | `/api/auth/signup` | POST | User registration |
| `/dashboard` | `/api/stats/summary` | GET | Aggregated dashboard numbers |
| `/analytics` | `/api/analytics/detailed` | GET | Detailed performance charts |
| `/pricing` | `/api/payments/verify` | POST | Verify Interswitch transaction |
| `/settings` | `/api/billing/invoices` | GET | View successful payments |
| `/transactional`| `/api/transactional/send`| POST | Send via API key |

## Setup Instructions (Conceptual)

1. **Install Dependencies**: `npm install express @prisma/client swagger-ui-express swagger-jsdoc bcryptjs jsonwebtoken helmet cors dotenv express-rate-limit`
2. **Install Prisma Dev**: `npm install prisma --save-dev`
3. **Configure Database**: Update `DATABASE_URL` in `.env`.
4. **Generate Client**: `npx prisma generate`
5. **Deploy Migrations**: `npx prisma migrate dev`
6. **Start Server**: `node server.js`

## Prisma Schema Additions
In a production environment, you would add these to your `schema.prisma`:

```prisma
model Transaction {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  reference     String   @unique
  amount        Int      // In Kobo
  status        String   // SUCCESS, PENDING, FAILED
  planId        String
  createdAt     DateTime @default(now())
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}
```