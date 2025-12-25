# Sales Overview Dashboard 📊

A comprehensive sales and logistics dashboard built with React, TypeScript, and Express. Track regional sales data, optimize logistics, and manage inventory across multiple locations in India.

## ✨ Features

- 📍 **Regional Dashboard** - Visualize sales data across Indian regions
- 📦 **Inventory Tracking** - Monitor stock levels and modes
- 🚚 **Logistics Management** - Track freight, capacity, and delivery routes
- 📈 **KPI Analytics** - Real-time metrics for EXW, FOR, and aggregated totals
- 🗺️ **Interactive Map** - Visual representation of regional distribution
- 🔄 **Live Updates** - Real-time data synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Git
- Git Bash (for Windows)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/Sales-Overview.git
cd Sales-Overview

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env

# 4. Initialize database
npm run db:push

# 5. Start development server
npm run dev
```

Visit: **http://localhost:5000**

## 📦 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push database schema |

## 🏗️ Project Structure

```
Sales-Overview/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page routes
│   │   ├── hooks/         # Custom hooks
│   │   └── App.tsx        # Main app
│   └── index.html         # Entry point
├── server/                 # Express backend
│   ├── db.ts              # Database setup
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data operations
│   └── index.ts           # Server entry
├── shared/                 # Shared code
│   ├── schema.ts          # Database schema
│   └── routes.ts          # Type-safe routes
├── migrations/             # Database migrations
└── package.json           # Dependencies

```

## 🗄️ Database

This project uses **SQLite** for local development (easily switchable to PostgreSQL).

```bash
# Initialize database
npm run db:push

# Database file
dev.db
```

### Environment Variables

Create `.env` file:

```env
DATABASE_URL=file:./dev.db
NODE_ENV=development
PORT=5000
```

See `.env.example` for all options.

## 📝 Git Workflow

### Setup Git Bash (Windows Users)

```bash
# Option 1: Double-click
open-git-bash.bat

# Option 2: Right-click → Git Bash Here

# Option 3: Use Git helper script
bash git-helper.sh
```

### Daily Commands

```bash
# Check changes
git status

# Create feature branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat: Added awesome feature"

# Push to GitHub
git push origin feature/my-feature
```

See [GIT_QUICK_REFERENCE.md](GIT_QUICK_REFERENCE.md) for more commands.

## 🌐 GitHub Setup

Follow [GITHUB_SETUP.md](GITHUB_SETUP.md) to:
1. Create GitHub repository
2. Link local code to GitHub
3. Push your code

Quick summary:
```bash
git remote add origin https://github.com/YOUR-USERNAME/Sales-Overview.git
git push -u origin main
```

## 🚀 Deployment

See [GIT_HOSTING_GUIDE.md](GIT_HOSTING_GUIDE.md) for hosting options:

- **Render.com** - Recommended for Node.js
- **Heroku** - Easy deployment
- **Railway.app** - Modern alternative
- **Vercel** - For serverless
- **Self-hosted** - VPS/Dedicated server

### Quick Render.com Deploy

1. Push code to GitHub
2. Create account at https://render.com
3. Connect GitHub repository
4. Set `DATABASE_URL` environment variable
5. Deploy!

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Recharts (Data Visualization)
- Framer Motion (Animations)
- TanStack Query (Data fetching)

**Backend:**
- Express.js
- SQLite / PostgreSQL
- Drizzle ORM
- Zod (Validation)

**Development:**
- Vite (Build tool)
- TSX (TypeScript executor)
- Drizzle Kit (Database management)

## 📚 Documentation

- [GIT_QUICK_REFERENCE.md](GIT_QUICK_REFERENCE.md) - Git commands cheat sheet
- [GITHUB_SETUP.md](GITHUB_SETUP.md) - GitHub configuration guide
- [GIT_HOSTING_GUIDE.md](GIT_HOSTING_GUIDE.md) - Deployment options

## 🐛 Troubleshooting

### Port Already in Use
```bash
set PORT=3000
npm run dev
```

### Database Error
```bash
npm run db:push
```

### Dependencies Issue
```bash
npm install
npm ci  # For CI/CD environments
```

### Git Remote Error
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/Sales-Overview.git
```

## 📧 Environment Setup

### For Windows Users

1. **Install Git** - https://git-scm.com/download/win
2. **Install Node.js** - https://nodejs.org/
3. **Create `.env` file**:
   ```bash
   copy .env.example .env
   ```

### For Mac/Linux Users

```bash
# Install Homebrew (Mac)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and Git
brew install node git

# Or use system package manager (Linux)
sudo apt-get install nodejs npm git
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "feat: Add feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Create Pull Request

## 📄 License

MIT License - feel free to use this project!

## 🎯 Roadmap

- [ ] Advanced analytics and reporting
- [ ] Export to PDF/Excel
- [ ] Multi-user authentication
- [ ] Mobile app version
- [ ] Real-time notifications
- [ ] Predictive analytics

## 💡 Tips

- **Always pull before pushing**
  ```bash
  git pull origin main
  git push origin main
  ```

- **Use descriptive commit messages**
  ```bash
  git commit -m "feat: Add dark mode support"
  git commit -m "fix: Resolve database timeout issue"
  ```

- **Review changes before committing**
  ```bash
  git diff          # See what changed
  git add .         # Stage files
  git diff --staged # Review staged changes
  git commit -m "..." # Then commit
  ```

## 🆘 Need Help?

- **GitHub Issues**: Create an issue in the repository
- **Git Help**: `git help COMMAND`
- **Documentation**: Read the `.md` files in project root

---

**Happy coding! 🎉**

For Git help, run:
```bash
bash git-helper.sh
```

For quick Git commands reference:
- See [GIT_QUICK_REFERENCE.md](GIT_QUICK_REFERENCE.md)
- See [GITHUB_SETUP.md](GITHUB_SETUP.md)
- See [GIT_HOSTING_GUIDE.md](GIT_HOSTING_GUIDE.md)
