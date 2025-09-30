# GitHub Pages Deployment Guide

This guide will walk you through deploying your Deepfake Detective game to GitHub Pages.

## Prerequisites

### 1. Install Git
If you don't have Git installed, download and install it:

**Windows:**
- Download from: https://git-scm.com/download/win
- Follow the installation wizard (use default settings)
- Restart your terminal/PowerShell after installation

**Mac:**
```bash
# Using Homebrew (recommended)
brew install git

# Or download from: https://git-scm.com/download/mac
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install git

# CentOS/RHEL
sudo yum install git
```

### 2. GitHub Account
- Create a free account at: https://github.com
- Verify your email address

## Deployment Steps

### Step 1: Prepare Your Repository
1. Open PowerShell/Terminal in your project folder
2. Initialize Git repository:
   ```bash
   git init
   ```

3. Add all files:
   ```bash
   git add .
   ```

4. Create initial commit:
   ```bash
   git commit -m "Initial commit: Deepfake Detective game"
   ```

### Step 2: Create GitHub Repository
1. Go to https://github.com and sign in
2. Click the "+" icon → "New repository"
3. Repository name: `deepfake_game` (or your preferred name)
4. Description: "AI vs Real Image Detection Game for iPad Kiosks"
5. Make it **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### Step 3: Connect Local Repository to GitHub
Replace `yourusername` with your actual GitHub username:

```bash
git remote add origin https://github.com/yourusername/deepfake_game.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **"GitHub Actions"**
5. The deployment will start automatically

### Step 5: Wait for Deployment
- Go to the **Actions** tab to see deployment progress
- First deployment takes 2-5 minutes
- Green checkmark = successful deployment
- Red X = deployment failed (check logs)

### Step 6: Access Your Live Game
Your game will be available at:
```
https://yourusername.github.io/deepfake_game
```

## Automatic Updates

Once set up, any changes you push to the main branch will automatically redeploy:

```bash
# Make your changes, then:
git add .
git commit -m "Describe your changes"
git push
```

## Custom Domain (Optional)

To use your own domain:

1. In your repository settings → Pages
2. Under "Custom domain", enter your domain
3. Add a `CNAME` file to your repository root with your domain
4. Configure your domain's DNS to point to GitHub Pages

## Troubleshooting

### Common Issues:

**Git not recognized:**
- Install Git from https://git-scm.com
- Restart your terminal
- Try `git --version` to verify installation

**Permission denied (GitHub):**
- Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Or use GitHub CLI: https://cli.github.com/

**Pages not updating:**
- Check Actions tab for deployment status
- Clear browser cache
- Wait a few minutes for DNS propagation

**404 Error on live site:**
- Ensure repository is public
- Check that Pages source is set to "GitHub Actions"
- Verify the repository name matches the URL

### Getting Help:
- GitHub Pages documentation: https://pages.github.com/
- GitHub Actions documentation: https://docs.github.com/en/actions

## Alternative Deployment Options

### Netlify (Alternative to GitHub Pages)
1. Go to https://netlify.com
2. Drag and drop your project folder
3. Get instant live URL
4. Connect to GitHub for automatic updates

### Vercel (Another Alternative)
1. Go to https://vercel.com
2. Import your GitHub repository
3. Deploy with zero configuration
4. Get custom domain and analytics

### Firebase Hosting
See `FIREBASE_SETUP.md` for Firebase deployment instructions.

---

## Next Steps After Deployment

1. **Test the live game** on different devices
2. **Add your real image pairs** (replace the SVG placeholders)
3. **Configure Firebase** for the leaderboard functionality
4. **Share your game** with friends and test users
5. **Monitor usage** through GitHub repository insights

Happy gaming! 🎮