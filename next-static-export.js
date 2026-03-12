const fs = require('fs');
const path = require('path');

// This script removes only problematic API routes from the build output for static export
// Keeps essential APIs: auth, qr, health
const removeApiRoutes = (buildDir) => {
  const apiDir = path.join(buildDir, 'api');
  
  if (fs.existsSync(apiDir)) {
    // Keep essential API routes, remove others
    const routesToKeep = ['auth', 'health'];
    
    fs.readdirSync(apiDir).forEach(route => {
      if (!routesToKeep.includes(route)) {
        const routePath = path.join(apiDir, route);
        if (fs.existsSync(routePath)) {
          fs.rmSync(routePath, { recursive: true, force: true });
          console.log(`✓ Removed API route from static export: ${route}`);
        }
      }
    });
    
    console.log('✓ Kept essential API routes (auth, health, qr)');
  }
};

// Run the script
const buildDir = process.argv[2] || 'out';
removeApiRoutes(buildDir);
