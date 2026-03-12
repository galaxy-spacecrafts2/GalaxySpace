// API configuration for different platforms
export const API_CONFIG = {
  // Base URL for API requests
  getBaseUrl: () => {
    // For mobile builds, use the configured API base URL
    if (process.env.NEXT_PUBLIC_PLATFORM === 'mobile') {
      return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-app.vercel.app';
    }
    
    // For web builds, use relative paths or current origin
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    
    // Fallback for server-side rendering
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  },
  
  // Helper to construct full API URLs
  buildUrl: (path: string) => {
    const baseUrl = API_CONFIG.getBaseUrl();
    // Remove leading slash from path if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}/${cleanPath}`;
  },
  
  // Platform detection
  isMobile: () => process.env.NEXT_PUBLIC_PLATFORM === 'mobile',
  isWeb: () => process.env.NEXT_PUBLIC_PLATFORM !== 'mobile',
};

// Export common API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
  },
  HEALTH: '/api/health',
} as const;
