const fs = require('fs');
const path = require('path');

// This script creates a mobile-specific build by excluding API routes
const createMobileBuild = () => {
  const appDir = path.join(process.cwd(), 'app');
  const apiDir = path.join(appDir, 'api');
  const authDir = path.join(appDir, 'auth');
  
  // Create backup directories
  const apiBackup = path.join(process.cwd(), 'app-api-backup');
  const authBackup = path.join(process.cwd(), 'app-auth-backup');
  
  // Move API and auth directories to backup
  if (fs.existsSync(apiDir)) {
    if (fs.existsSync(apiBackup)) {
      fs.rmSync(apiBackup, { recursive: true, force: true });
    }
    fs.renameSync(apiDir, apiBackup);
    console.log('✓ Moved API directory to backup');
  }
  
  if (fs.existsSync(authDir)) {
    if (fs.existsSync(authBackup)) {
      fs.rmSync(authBackup, { recursive: true, force: true });
    }
    fs.renameSync(authDir, authBackup);
    console.log('✓ Moved auth directory to backup');
  }
  
  // Create placeholder API directory with empty routes
  const placeholderApiDir = path.join(appDir, 'api');
  fs.mkdirSync(placeholderApiDir, { recursive: true });
  const healthDir = path.join(placeholderApiDir, 'health');
  fs.mkdirSync(healthDir, { recursive: true });
  
  // Create a simple health route for mobile
  const healthRoute = `// Mobile placeholder route
export const dynamic = 'force-static';
export const revalidate = false;

export function generateStaticParams() {
  return [];
}

export async function GET() {
  return Response.json({ 
    status: 'mobile-placeholder',
    message: 'API calls are handled by server' 
  });
}`;
  
  fs.writeFileSync(path.join(healthDir, 'route.ts'), healthRoute);
  console.log('✓ Created placeholder API routes');
};

// This script restores the original directories after build
const restoreOriginalBuild = () => {
  const appDir = path.join(process.cwd(), 'app');
  const apiBackup = path.join(process.cwd(), 'app-api-backup');
  const authBackup = path.join(process.cwd(), 'app-auth-backup');
  const apiDir = path.join(appDir, 'api');
  const authDir = path.join(appDir, 'auth');
  
  // Remove placeholder directories
  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
  }
  
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
  }
  
  // Restore original directories
  if (fs.existsSync(apiBackup)) {
    fs.renameSync(apiBackup, apiDir);
    console.log('✓ Restored API directory');
  }
  
  if (fs.existsSync(authBackup)) {
    fs.renameSync(authBackup, authDir);
    console.log('✓ Restored auth directory');
  }
};

// Run based on command line argument
const command = process.argv[2];
if (command === 'prepare') {
  createMobileBuild();
} else if (command === 'restore') {
  restoreOriginalBuild();
} else {
  console.log('Usage: node mobile-build.js [prepare|restore]');
}
