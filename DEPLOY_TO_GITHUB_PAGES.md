# Deploying This Project to GitHub Pages

This project is pre-configured for automated 1-click deployment to **GitHub Pages** using GitHub Actions and Vite with relative paths (`base: './'`).

---

## Quick Setup Instructions

### Option A: From your local machine or terminal

1. **Create a new repository** on [github.com/new](https://github.com/new) (e.g. named `torchbound-tiny-explainer`).

2. **Link the remote and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub -> **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions**.
   - The included workflow `.github/workflows/deploy.yml` will automatically build and publish your site to:
     `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

### Option B: Push directly from AI Studio

If you want the bot to push directly to your repository:
Reply in the chat with your GitHub repository URL (and Personal Access Token if it's private or requires authentication):

```bash
git remote add origin https://<TOKEN>@github.com/<USERNAME>/<REPO>.git
git push -u origin main
```
The bot can execute this command immediately.
