# Push Your Code to GitHub with Git Bash

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - **Repository name**: Sales-Overview
   - **Description**: Sales Dashboard with Regional Analytics
   - **Privacy**: Public or Private (your choice)
   - **Initialize repository**: DO NOT check any options
3. Click "Create repository"

## Step 2: Set Up Remote in Git Bash

Open Git Bash in your project directory and run:

```bash
# Remove old remote (if exists)
git remote remove gitsafe-backup

# Add GitHub as new remote
git remote add origin https://github.com/YOUR-USERNAME/Sales-Overview.git

# Verify remote is set correctly
git remote -v
```

**Example (replace with your GitHub username):**
```bash
git remote add origin https://github.com/JohnDoe/Sales-Overview.git
```

## Step 3: Push to GitHub

### First time push:
```bash
git branch -M main
git push -u origin main
```

### Subsequent pushes:
```bash
git push origin main
```

## Step 4: (Optional) Use SSH Instead of HTTPS

If you want to avoid entering password every time:

### Generate SSH Key (if you don't have one):
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# Press Enter for all prompts
```

### Add SSH key to GitHub:
1. Copy your SSH key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to https://github.com/settings/keys
3. Click "New SSH key"
4. Paste the key and save

### Update remote to use SSH:
```bash
git remote set-url origin git@github.com:YOUR-USERNAME/Sales-Overview.git
```

## Step 5: Verify It Worked

```bash
# Check remote URL
git remote -v

# View your code on GitHub
# Open: https://github.com/YOUR-USERNAME/Sales-Overview
```

## Common Git Bash Commands

### View your work
```bash
git status              # Current status
git log                 # Commit history
git diff                # Show changes
```

### Make changes
```bash
git add .               # Stage all files
git commit -m "message" # Create commit
git push                # Push to GitHub
```

### Work with branches
```bash
git checkout -b feature/my-feature   # Create branch
git checkout main                    # Switch to main
git merge feature/my-feature         # Merge branch
git branch -d feature/my-feature     # Delete branch
```

### Undo changes
```bash
git restore .                # Discard all local changes
git reset HEAD~1             # Undo last commit (keep changes)
git revert <commit-hash>     # Revert a specific commit
```

## Hosting on GitHub Pages (Frontend Only)

If you want to host just the frontend:

```bash
npm run build
# Push the dist/ folder to GitHub Pages
```

Then enable GitHub Pages in repository settings.

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Run the commands in "Step 2" and "Step 3"
3. ✅ Verify on GitHub.com
4. 🚀 Start using Git for version control!

---

**Having trouble?** Common issues:

- **"fatal: unable to look up gitsafe"**: This is the old server. Follow Step 2 to update to GitHub.
- **"Permission denied (publickey)"**: You need to set up SSH keys (Step 4)
- **"Could not resolve host"**: Check your internet connection

**More help**: https://docs.github.com/en/get-started
