# Frontend Environment Setup Guide

This guide explains how to set up environment variables for the AI Tools Frontend application.

## 🚀 Quick Setup

1. **Create a `.env` file** in the `clerk-react` directory
2. **Add the required environment variables** (see below)
3. **Restart your development server**

## 📋 Required Environment Variables

Create a `.env` file in the `clerk-react` directory with the following variables:

```env
# Backend API URL (Production)
VITE_API_BASE_URL=https://aibackend-snky.onrender.com/api/ai-tools

# Development Backend URL (for local development)
# VITE_API_BASE_URL=http://localhost:5001/api/ai-tools

# Environment
VITE_NODE_ENV=production

# App Configuration
VITE_APP_NAME=AI Tools Platform
VITE_APP_VERSION=1.0.0

# Clerk Configuration (if needed)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

## 🔧 Environment Variable Details

### `VITE_API_BASE_URL`
- **Description**: The base URL for your backend API
- **Production**: `https://aibackend-snky.onrender.com/api/ai-tools`
- **Development**: `http://localhost:5001/api/ai-tools`
- **Required**: Yes

### `VITE_NODE_ENV`
- **Description**: Current environment
- **Values**: `production`, `development`
- **Default**: `development`
- **Required**: No

### `VITE_APP_NAME`
- **Description**: Application name
- **Default**: `AI Tools Platform`
- **Required**: No

### `VITE_APP_VERSION`
- **Description**: Application version
- **Default**: `1.0.0`
- **Required**: No

### `VITE_CLERK_PUBLISHABLE_KEY`
- **Description**: Clerk authentication publishable key
- **Required**: Only if using Clerk authentication

## 🌍 Environment-Specific Configurations

### Development Environment
```env
VITE_API_BASE_URL=http://localhost:5001/api/ai-tools
VITE_NODE_ENV=development
```

### Production Environment
```env
VITE_API_BASE_URL=https://aibackend-snky.onrender.com/api/ai-tools
VITE_NODE_ENV=production
```

### Staging Environment
```env
VITE_API_BASE_URL=https://your-staging-backend.com/api/ai-tools
VITE_NODE_ENV=production
```

## 🔒 Security Notes

- **Never commit `.env` files** to version control
- **Use different API keys** for different environments
- **Validate environment variables** in your application
- **Use HTTPS** in production

## 🛠️ Usage in Code

The environment variables are automatically available in your React components:

```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isProduction = import.meta.env.VITE_NODE_ENV === 'production';

// Or use the config helper
import { config } from './config/env';
const apiUrl = config.api.baseUrl;
```

## 🚀 Deployment

### Vercel
1. Go to your Vercel project settings
2. Add environment variables in the "Environment Variables" section
3. Deploy your application

### Netlify
1. Go to your Netlify site settings
2. Add environment variables in the "Environment variables" section
3. Redeploy your application

### Other Platforms
Most deployment platforms have environment variable configuration in their dashboard.

## 🔍 Troubleshooting

### Environment Variables Not Loading
1. **Restart your development server** after adding `.env` file
2. **Check file location** - `.env` should be in the `clerk-react` directory
3. **Verify variable names** - they must start with `VITE_`
4. **Check for typos** in variable names

### API Connection Issues
1. **Verify the backend URL** is correct
2. **Check if the backend is running** (for development)
3. **Test the API endpoint** directly
4. **Check CORS configuration** on the backend

### Production Issues
1. **Set environment variables** in your deployment platform
2. **Use HTTPS URLs** in production
3. **Check network connectivity**
4. **Verify API endpoints** are accessible

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Clerk Documentation](https://clerk.com/docs)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your environment variables are set correctly
3. Test API endpoints directly
4. Check browser console for errors 