# Vercel Environment Variables Setup

This guide provides all the environment variables you need to configure in Vercel for deploying your AI Tools Platform frontend.

## 🚀 Quick Setup

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable listed below
4. Deploy your application

## 📋 Required Environment Variables

### 🔗 Backend API Configuration

| Variable Name | Value | Description | Required |
|---------------|-------|-------------|----------|
| `VITE_API_BASE_URL` | `https://aibackend-snky.onrender.com/api/ai-tools` | Production backend API URL | ✅ Yes |
| `VITE_NODE_ENV` | `production` | Environment mode | ✅ Yes |

### 🔐 Authentication (Clerk)

| Variable Name | Value | Description | Required |
|---------------|-------|-------------|----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | Your Clerk publishable key | ✅ Yes |

### 📱 App Configuration

| Variable Name | Value | Description | Required |
|---------------|-------|-------------|----------|
| `VITE_APP_NAME` | `AI Tools Platform` | Application name | ❌ No |
| `VITE_APP_VERSION` | `1.0.0` | Application version | ❌ No |

## 🔧 Step-by-Step Vercel Configuration

### 1. Access Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### 2. Add Each Variable

#### Backend API URL
```
Name: VITE_API_BASE_URL
Value: https://aibackend-snky.onrender.com/api/ai-tools
Environment: Production, Preview, Development
```

#### Environment Mode
```
Name: VITE_NODE_ENV
Value: production
Environment: Production, Preview, Development
```

#### Clerk Publishable Key
```
Name: VITE_CLERK_PUBLISHABLE_KEY
Value: pk_test_your_clerk_key_here
Environment: Production, Preview, Development
```

#### App Name (Optional)
```
Name: VITE_APP_NAME
Value: AI Tools Platform
Environment: Production, Preview, Development
```

#### App Version (Optional)
```
Name: VITE_APP_VERSION
Value: 1.0.0
Environment: Production, Preview, Development
```

### 3. Environment Selection
For each variable, select:
- ✅ **Production** - Live website
- ✅ **Preview** - Preview deployments
- ✅ **Development** - Development deployments

## 🔍 How to Get Your Clerk Key

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **API Keys** in the sidebar
4. Copy your **Publishable Key**
5. Use the **Live** key for production, **Test** key for development

## 🌍 Environment-Specific Configurations

### Production Environment
```env
VITE_API_BASE_URL=https://aibackend-snky.onrender.com/api/ai-tools
VITE_NODE_ENV=production
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
VITE_APP_NAME=AI Tools Platform
VITE_APP_VERSION=1.0.0
```

### Development Environment
```env
VITE_API_BASE_URL=http://localhost:5001/api/ai-tools
VITE_NODE_ENV=development
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_test_key
VITE_APP_NAME=AI Tools Platform (Dev)
VITE_APP_VERSION=1.0.0
```

## 🔒 Security Best Practices

### ✅ Do's
- Use different Clerk keys for production and development
- Use HTTPS URLs in production
- Keep your Clerk secret keys secure (never expose in frontend)
- Use environment-specific configurations

### ❌ Don'ts
- Never commit environment variables to Git
- Don't use development URLs in production
- Don't expose sensitive API keys in frontend code
- Don't use the same keys across environments

## 🚀 Deployment Checklist

Before deploying to Vercel:

- [ ] Backend is deployed and accessible
- [ ] Clerk application is configured
- [ ] All environment variables are set in Vercel
- [ ] CORS is configured on backend for your Vercel domain
- [ ] API endpoints are tested
- [ ] Authentication flow is working

## 🔧 Vercel Configuration

### Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Domain Configuration
- Your app will be available at: `https://your-project-name.vercel.app`
- Add custom domain in Vercel settings if needed

## 🐛 Troubleshooting

### Environment Variables Not Loading
1. **Check variable names** - must start with `VITE_`
2. **Verify environment selection** - select all environments
3. **Redeploy** after adding variables
4. **Clear browser cache** and hard refresh

### API Connection Issues
1. **Verify backend URL** is correct
2. **Check CORS configuration** on backend
3. **Test API endpoints** directly
4. **Verify backend is running**

### Authentication Issues
1. **Check Clerk key** is correct
2. **Verify Clerk application** is configured
3. **Check domain settings** in Clerk dashboard
4. **Clear browser cache** and cookies

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test API endpoints directly
4. Check browser console for errors
5. Review Clerk documentation

## 🔗 Useful Links

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Clerk Documentation](https://clerk.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Your Backend API](https://aibackend-snky.onrender.com/api/health) 