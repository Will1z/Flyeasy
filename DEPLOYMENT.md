# Flyeasy Bolt - Deployment Guide

This guide will help you deploy Flyeasy Bolt to GitHub and Netlify while ensuring no API keys are leaked.

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub.com and create a new repository
   - Don't initialize with README, .gitignore, or license (we already have these)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploy Frontend to Netlify

1. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: Leave empty (root)

3. **Set Environment Variables** in Netlify:
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically build and deploy your frontend

### 3. Deploy Backend (Choose One Option)

#### Option A: Deploy to Railway (Recommended)

1. **Create Railway Account**:
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set the root directory to `server`

3. **Configure Environment Variables**:
   - Go to Variables tab
   - Add all variables from `server/env.example`

4. **Set Build Command**:
   - In the Settings tab, set build command to: `npm install`

5. **Set Start Command**:
   - Set start command to: `npm start`

#### Option B: Deploy to Render

1. **Create Render Account**:
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set root directory to `server`

3. **Configure Service**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. **Add Environment Variables**:
   - Add all variables from `server/env.example`

### 4. Update Frontend API URL

After deploying your backend, update the `VITE_API_URL` environment variable in Netlify to point to your deployed backend URL.

## 🔐 Environment Variables Setup

### Frontend (Netlify)
- `VITE_API_URL`: Your backend API URL (e.g., `https://your-app.railway.app/api`)

### Backend (Railway/Render)
Copy all variables from `server/env.example` and replace placeholder values:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# JWT Secret (generate a strong random string)
JWT_SECRET=your_actual_jwt_secret_here

# API Keys (replace with your actual keys)
TRAVELPAYOUTS_API_KEY=your_actual_travelpayouts_key
PAYSTACK_SECRET_KEY=your_actual_paystack_key
OPENAI_API_KEY=your_actual_openai_key
AVIATIONSTACK_API_KEY=your_actual_aviationstack_key
EXCHANGERATE_API_KEY=your_actual_exchangerate_key

# Email Configuration
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASS=your_actual_email_app_password

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app.netlify.app
```

## 🔒 Security Checklist

- ✅ No API keys in code (all use environment variables)
- ✅ `.env` files in `.gitignore`
- ✅ Database files in `.gitignore`
- ✅ `node_modules` in `.gitignore`
- ✅ Build artifacts in `.gitignore`
- ✅ Environment variables set in deployment platform
- ✅ CORS configured for production domains

## 🛠️ Local Development

1. **Clone repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Setup Frontend**:
   ```bash
   npm install
   npm run dev
   ```

3. **Setup Backend**:
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your actual API keys
   npm install
   npm start
   ```

## 📝 Important Notes

- **Never commit `.env` files** - they contain sensitive information
- **Use different API keys** for development and production
- **Monitor your API usage** to avoid unexpected charges
- **Set up proper CORS** for your production domains
- **Use HTTPS** in production for security

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in backend environment variables
2. **API Key Errors**: Verify all API keys are set in your deployment platform
3. **Build Failures**: Check that all dependencies are in `package.json`
4. **Database Issues**: Railway/Render will create a new database, so you'll need to reinitialize

### Getting Help:
- Check the deployment platform logs for error messages
- Verify environment variables are set correctly
- Ensure all required dependencies are installed

## 🎉 Success!

Once deployed, your app will be available at:
- **Frontend**: `https://your-app.netlify.app`
- **Backend**: `https://your-app.railway.app` (or your chosen platform)

Remember to update the `VITE_API_URL` in Netlify to point to your deployed backend! 