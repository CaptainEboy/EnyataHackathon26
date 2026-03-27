# SendNRest 🚀

SendNRest is a powerful, lightweight email campaign infrastructure designed to seamlessly manage contacts, dispatch bulk emails, and track engagement analytics using a transparent pixel tracking engine. Built for efficiency and scale, SendNRest gives you real-time visibility into your outreach efforts.

## 🌟 Key Features
- **Campaign Management**: Compose and dispatch rich HTML email campaigns.
- **Contact Management**: Keep your audiences organized with customizable tags.
- **Engagement Tracking**: A built-in 1x1 transparent GIF interception engine to track exact email opens and campaign success rates.
- **Detailed Analytics Dashboard**: Monitor your engagement trends, open rates, and recent activity.
- **Secure Authentication**: JWT-based authentication with bcrypt-secured credentials.

## 🛠️ Technology Stack
- **Frontend**: Next.js (React 19), Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, Prisma ORM (Adapter-PG), Nodemailer
- **Database**: PostgreSQL
- **MTA (Mail Transfer Agent)**: Mailtrap SMTP / Custom SMTP Server

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Mailtrap Account (for tracking Sandbox emails)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sendnrest.git
   cd sendnrest
   ```

2. Setup the Backend:
   ```bash
   cd backend
   npm install
   # Create a .env file and update the DATABASE_URL and MAILTRAP credentials
   npx prisma generate
   npx prisma db push
   npm start # (Or node server.js)
   ```

3. Setup the Frontend:
   ```bash
   cd ../snr-fe
   npm install
   # Create a .env file with your specific API environment variables
   npm run dev
   ```

### 💡 Usage Examples
1. **Dashboard Overview**: After logging in, the dashboard immediately calculates your overall open rate, active contacts, and sends from your previous campaigns.
2. **Adding Contacts**: Navigate to the Contacts tab to add users to your mailing list with specific tags like `newsletter` or `leads`.
3. **Dispatch a Campaign**: Fill out the Campaign Subject and Content. Once dispatched, the `Infrastructure Node` uses the configured MTA (like Mailtrap) to send out personalized copies of your campaign. Each email includes a 1x1 tracking pixel!
4. **Tracking Analytics**: When a user opens the email, the tracking pixel triggers an event logging the IP and time, which instantly increments the Open Count on your dashboard!

## 🔐 Security & Operations
The project uses strict Helmet security headers, CORS origins (whitelisted securely to your frontend environments), and JWT HTTP-only cookies to ensure your email campaigns and analytics are never tampered with.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request if you find any bugs or have feature requests.
