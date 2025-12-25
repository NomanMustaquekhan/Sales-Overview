# Sales Overview - Git & Hosting Guide

## Quick Start with Git Bash

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Sales-Overview
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
Create a `.env` file:
```env
DATABASE_URL=file:./dev.db
```

### 4. Initialize Database
```bash
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:5000**

---

## Git Commands for Development

### View commit history
```bash
git log
```

### Create a new branch
```bash
git checkout -b feature/your-feature-name
```

### Stage changes
```bash
git add .
```

### Commit changes
```bash
git commit -m "feat: Your feature description"
```

### Push to remote
```bash
git push origin main
git push origin feature/your-feature-name
```

### Pull latest changes
```bash
git pull origin main
```

---

## Hosting Options

### Option 1: Render.com (Recommended for Node.js)
1. Create account at https://render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Set environment variables in Render dashboard
5. Deploy

### Option 2: Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Option 3: Vercel (for Frontend + Serverless Backend)
```bash
npm install -g vercel
vercel
```

### Option 4: Railway.app
1. Push to GitHub
2. Connect at https://railway.app
3. Set `DATABASE_URL` and deploy

### Option 5: Self-Hosted (VPS/Dedicated Server)
```bash
# SSH into your server
ssh user@your-server-ip

# Clone repo
git clone <repository-url>
cd Sales-Overview

# Install and run with PM2
npm install -g pm2
npm install
npm run build
pm2 start "npm run start" --name "sales-overview"
```

---

## Available Scripts

```bash
npm run dev        # Start development server (port 5000)
npm run build      # Build for production
npm run start      # Run production build
npm run check      # TypeScript type checking
npm run db:push    # Push database schema changes
```

---

## Project Structure

```
Sales-Overview/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types & routes
├── migrations/      # Database migrations
├── .env            # Environment variables (local only)
├── package.json    # Dependencies & scripts
└── vite.config.ts  # Build configuration
```

---

## Troubleshooting

### Port 5000 already in use
```bash
# Change port in server/index.ts or set environment variable
set PORT=3000
npm run dev
```

### Database errors
```bash
npm run db:push    # Re-initialize schema
```

### Dependencies issues
```bash
npm install        # Reinstall all packages
npm ci              # Clean install (recommended for CI/CD)
```

---

## CI/CD Pipeline Example (.github/workflows/deploy.yml)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run check
      - run: npm run build
      - run: npm run db:push
      # Deploy to your hosting service here
```

---

## Next Steps
1. Push code to GitHub: `git remote add origin <your-repo-url>` → `git push -u origin main`
2. Set up hosting on your preferred platform
3. Configure environment variables on hosting platform
4. Deploy! 🚀
