# 🚀 Vercel Deployment Guide - ChainCacao

## ✅ What Was Fixed

1. **vercel.json** - Updated routing configuration to properly handle serverless functions and static files
2. **api/index.ts** - Added proper serverless handler exports for Vercel
3. **server.ts** - Fixed server initialization to work with Vercel's serverless environment
4. **package.json** - Simplified build and start scripts for Vercel compatibility
5. **.env.local** - Created for local development configuration

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

- A GitHub account with the ChainCacao repository
- A Vercel account (sign up at https://vercel.com)
- Node.js 18+ installed locally

## 🔧 Local Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Add your JWT_SECRET and GEMINI_API_KEY:
     ```bash
     JWT_SECRET=your_jwt_secret_here
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

3. **Test locally:**

   ```bash
   npm run dev
   ```

   The app should be available at http://localhost:3000

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🌐 Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub:

   ```bash
   git add .
   git commit -m "Fix: Prepare ChainCacao for Vercel deployment"
   git push origin main
   ```

2. Go to https://vercel.com/dashboard

3. Click **"Add New..."** → **"Project"**

4. Select your GitHub repository (ChainCacao)

5. In the project settings:
   - **Framework**: Select "Other"
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Add environment variables in the Vercel dashboard:
   - `JWT_SECRET` = your_jwt_secret_here
   - `GEMINI_API_KEY` = your_gemini_api_key_here
   - `NODE_ENV` = production

7. Click **"Deploy"**

### Option 2: Vercel CLI

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Deploy from project root:

   ```bash
   vercel --prod
   ```

3. Follow the prompts and set environment variables when asked

## 🔗 Accessing Your Deployment

After deployment, your app will be available at:

- `https://your-project-name.vercel.app`

## 📊 Project Structure

```
ChainCacao/
├── api/
│   └── index.ts              # Serverless handler for Vercel
├── frontend/
│   ├── src/                  # React components and pages
│   └── index.html            # Entry HTML file
├── server.ts                 # Express server (handles API & static files)
├── vite.config.ts            # Vite build configuration
├── vercel.json               # Vercel deployment configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and build scripts
```

## 🚨 Important Notes

### API Routes

All API routes start with `/api/` and are handled by the serverless function in `api/index.ts`:

- `/api/auth/login` - User authentication
- `/api/dashboard/init` - Dashboard initialization
- `/api/admin/users` - User management
- `/api/cacao/*` - Cacao lot tracking

### Frontend Files

Static files (CSS, JS, images) are served from the `dist/` directory after Vite build.
The SPA fallback ensures all routes return `index.html` for React Router.

### Environment Variables

Set these in Vercel Project Settings → Environment Variables:

- `JWT_SECRET` - For JWT token signing (change from default in production!)
- `GEMINI_API_KEY` - For Google Generative AI API
- `NODE_ENV` - Set to "production" for Vercel

## 🐛 Troubleshooting

### Issue: "dist/index.html not found"

**Solution**: Ensure build completed successfully locally:

```bash
npm run build
ls dist/index.html  # Should exist
```

### Issue: API routes return 404

**Solution**: Verify `/api/index.ts` is present and contains proper exports

### Issue: Static files not loading

**Solution**: Check Vercel build logs. The `vite build` command should create `dist/` directory

### Issue: Environment variables not applied

**Solution**:

1. Set them in Vercel Dashboard under Project Settings
2. Redeploy after setting variables
3. Check Vercel deployment logs for confirmation

## 📝 Environment Variable Setup for Vercel

1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add:
   - Name: `JWT_SECRET`, Value: `your-secret-key`
   - Name: `GEMINI_API_KEY`, Value: `your-api-key`
4. Redeploy to apply changes

## 🔄 Redeployment

To redeploy after code changes:

1. Push changes to GitHub
2. Vercel automatically redeploys on push to main branch
3. Or click "Deploy" in Vercel Dashboard

## ✨ Key Improvements Made

- ✅ Fixed Vercel serverless configuration
- ✅ Simplified build process (removed unnecessary esbuild step)
- ✅ Proper static file serving from Vite output
- ✅ Correct API routing for serverless functions
- ✅ Added SPA fallback for React Router
- ✅ Environment variable support for production

Your ChainCacao app is now ready for Vercel deployment! 🎉
