# Git & GitHub Quick Reference

## Opening Git Bash

### Option 1: Double-click batch file (Windows)
```
open-git-bash.bat
```

### Option 2: Right-click in folder → "Git Bash Here"
Windows Explorer → Right-click → Git Bash Here

### Option 3: Command Prompt
```cmd
cd "c:\Users\LENOVO\Downloads\Sales-Overview (2)\Sales-Overview"
bash
```

---

## Essential Commands (in Git Bash)

### Initial Setup (One-time)
```bash
git config user.name "Your Name"
git config user.email "your@email.com"
git remote add origin https://github.com/USERNAME/Sales-Overview.git
```

### Daily Workflow
```bash
# 1. See what changed
git status

# 2. Stage changes
git add .

# 3. Save with a message
git commit -m "Fixed bug in dashboard"

# 4. Push to GitHub
git push

# 5. Get latest changes from team
git pull
```

### Branch Management
```bash
# Create new branch for feature
git checkout -b feature/add-export-button

# Switch between branches
git checkout main
git checkout feature/add-export-button

# See all branches
git branch -a

# Delete branch when done
git branch -d feature/add-export-button
```

### Viewing History
```bash
# See recent commits
git log --oneline -10

# See all changes
git diff

# See what's staged
git diff --staged
```

---

## Development Workflow

```bash
# 1. Start Git Bash
open-git-bash.bat

# 2. Pull latest code
git pull

# 3. Create feature branch
git checkout -b feature/my-feature

# 4. Start dev server
npm run dev

# 5. Make changes in VS Code

# 6. When done, stage and commit
git add .
git commit -m "feat: Added new dashboard widget"

# 7. Push to GitHub
git push origin feature/my-feature

# 8. Create Pull Request on GitHub
```

---

## File Status Legend

```
M   Modified
A   Added
D   Deleted
??  Untracked
```

---

## Undo Commands

```bash
# Discard all local changes (CAREFUL!)
git restore .

# Undo last commit (keep changes)
git reset HEAD~1

# Undo last commit (delete changes - CAREFUL!)
git reset --hard HEAD~1

# View what was in a previous state
git log --oneline
git show COMMIT_HASH
```

---

## Common Issues & Fixes

### "Permission denied (publickey)"
→ Set up SSH keys or use HTTPS with personal access token

### "fatal: destination path already exists"
→ Repository folder already exists

### "divergent branches"
→ Run: `git pull --rebase`

### "nothing to commit"
→ No changes made or already committed

---

## Files & Folders

```
.git/               ← Git data (don't edit!)
.gitignore          ← Files to ignore
GITHUB_SETUP.md     ← GitHub setup guide
GIT_HOSTING_GUIDE.md ← Hosting guide
git-helper.sh       ← Git helper script
open-git-bash.bat   ← Quick launch batch file
```

---

## Pro Tips

✅ **Always pull before pushing**
```bash
git pull
git push
```

✅ **Create descriptive commit messages**
```bash
# Good
git commit -m "feat: Add dark mode toggle to dashboard"

# Bad
git commit -m "update"
```

✅ **Use branches for new features**
```bash
git checkout -b feature/my-feature
# ... make changes ...
git push origin feature/my-feature
```

✅ **Review changes before committing**
```bash
git diff          # See changes
git add .         # Stage
git diff --staged # Review what's staged
git commit -m "..." # Then commit
```

---

## Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code refactor
- `perf`: Performance
- `test`: Tests

### Examples:
```
feat: Add region filtering to dashboard
fix: Resolve database connection timeout
docs: Update README with new features
```

---

## Learn More
- **GitHub Docs**: https://docs.github.com
- **Git Tutorial**: https://git-scm.com/book/en/v2
- **Git Cheat Sheet**: https://cheatography.com/samarthbhargava/cheat-sheets/git/
