# Deploying JSON Editor to Vercel

This guide will walk you through the process of deploying the JSON Editor application to Vercel.

## Prerequisites

1. A [GitHub](https://github.com/) account
2. A [Vercel](https://vercel.com/) account (you can sign up with your GitHub account)
3. Your Supabase project URL and anon key

## Deployment Steps

### 1. Push your code to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
# Initialize git repository if needed
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/json-editor.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

#### Option 1: Deploy via Vercel Dashboard (Recommended for first-time setup)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Select "Vite"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add Environment Variables:
   - Click "Environment Variables" section
   - Add the following variables:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_KEY`: Your Supabase anon key
6. Click "Deploy"

#### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. Follow the prompts and make sure to set the environment variables when asked.

### 3. Configure Environment Variables

If you need to update environment variables after deployment:

1. Go to your project in the Vercel Dashboard
2. Click on "Settings" > "Environment Variables"
3. Add or update the variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon key
4. Click "Save"
5. Redeploy your application for the changes to take effect

### 4. Set up a Custom Domain (Optional)

1. In your Vercel project dashboard, click on "Domains"
2. Add your custom domain and follow the instructions to configure DNS settings

## Troubleshooting

### Issue: Environment variables not working

If your application can't access the environment variables:

1. Make sure they are correctly set in the Vercel dashboard
2. Verify that your code is accessing them correctly using `process.env.VARIABLE_NAME`
3. Remember that environment variables are only injected during build time with Vite
4. Try redeploying the application after updating the variables

### Issue: Supabase connection errors

If you're seeing errors connecting to Supabase:

1. Check that your Supabase project is active
2. Verify that the URL and anon key are correct
3. Make sure your Supabase project allows requests from your Vercel domain (CORS settings)

## Automatic Deployments

Vercel automatically deploys your application when you push changes to your GitHub repository. This feature is enabled by default.

To disable automatic deployments:

1. Go to your project in the Vercel Dashboard
2. Click on "Settings" > "Git"
3. Scroll to "Deploy Hooks" section
4. Toggle off "Enable Deploy Hooks"

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Supabase Documentation](https://supabase.com/docs)
