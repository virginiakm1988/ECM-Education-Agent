# React UI Deployment to GitHub Pages

This guide explains how to deploy the ECM Education Agent React UI to GitHub Pages.

## Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Node.js**: Install Node.js (version 16 or higher)
3. **Git**: Git should be installed and configured

## Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `ECM-Agent` (or any name you prefer)
3. Make it public (required for free GitHub Pages)
4. Don't initialize with README (we'll push existing code)

### 2. Update Package.json

Update the `homepage` field in `package.json` with your GitHub username:

```json
{
  "homepage": "https://YOUR_GITHUB_USERNAME.github.io/ECM-Agent"
}
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

### 3. Initialize Git and Push Code

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: ECM Education Agent React UI"

# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ECM-Agent.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The deployment workflow will automatically run

### 5. Install Dependencies and Test Locally

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production (optional, to test)
npm run build
```

### 6. Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:

1. **Trigger** on every push to the `main` branch
2. **Install** dependencies
3. **Build** the React app
4. **Deploy** to GitHub Pages

### 7. Access Your Deployed App

After the workflow completes (usually 2-5 minutes), your app will be available at:

```
https://YOUR_GITHUB_USERNAME.github.io/ECM-Agent
```

## Manual Deployment (Alternative)

If you prefer manual deployment using gh-pages:

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Deploy to GitHub Pages
npm run deploy
```

## Configuration Options

### Custom Domain (Optional)

If you have a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Update the workflow file to include your domain
3. Configure DNS settings with your domain provider

### Environment Variables

For production environment variables:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets for any API keys
3. Update the workflow to use these secrets

### Base URL Configuration

The app automatically detects if it's running in production and sets the correct base URL for routing. The configuration in `App.js`:

```javascript
<Router basename={process.env.NODE_ENV === 'production' ? '/ECM-Agent' : ''}>
```

## Troubleshooting

### Common Issues

1. **404 Error**: Make sure the repository name matches the homepage URL
2. **Blank Page**: Check browser console for routing issues
3. **Build Fails**: Check Node.js version and dependencies

### Workflow Fails

Check the **Actions** tab in your repository to see detailed error logs.

### Update Deployment

To update your deployed app:

1. Make changes to your code
2. Commit and push to main branch
3. GitHub Actions will automatically redeploy

## File Structure

```
ECM-Agent/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   └── Layout.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── ECMExplanation.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── tailwind.config.js
└── README.md
```

## Features Included

- ✅ Responsive design with Tailwind CSS
- ✅ React Router for navigation
- ✅ Framer Motion animations
- ✅ React Query for data fetching
- ✅ Toast notifications
- ✅ Modern UI components
- ✅ GitHub Pages deployment
- ✅ Automatic CI/CD with GitHub Actions

## Next Steps

1. **Backend Integration**: Connect to your Python FastAPI backend
2. **API Configuration**: Set up API endpoints for ECM functionality
3. **Authentication**: Add user authentication if needed
4. **Analytics**: Add Google Analytics or similar tracking
5. **SEO**: Optimize for search engines

## Support

For issues with deployment:
1. Check the GitHub Actions logs
2. Verify all file paths and configurations
3. Ensure your repository is public
4. Check that GitHub Pages is enabled in repository settings

Your ECM Education Agent React UI should now be live on GitHub Pages! 🚀
