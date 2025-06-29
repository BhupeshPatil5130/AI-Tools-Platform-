// Environment configuration for the frontend application

export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/ai-tools',
    healthUrl: import.meta.env.VITE_API_BASE_URL?.replace('/ai-tools', '') || 'http://localhost:5001/api',
    timeout: 30000, // 30 seconds
  },
  
  // Environment
  env: import.meta.env.VITE_NODE_ENV || 'development',
  isProduction: import.meta.env.VITE_NODE_ENV === 'production',
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'AI Tools Platform',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  
  // Clerk Configuration (if needed)
  clerk: {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  },
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string = '') => {
  return `${config.api.baseUrl}${endpoint}`;
};

// Helper function to get health check URL
export const getHealthUrl = () => {
  return `${config.api.healthUrl}/health`;
};

// Type definitions for environment variables
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_NODE_ENV?: string;
    readonly VITE_APP_NAME?: string;
    readonly VITE_APP_VERSION?: string;
    readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
} 