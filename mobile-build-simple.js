const fs = require('fs');
const path = require('path');

// Simple mobile build that excludes only problematic API routes
const prepareMobileBuild = () => {
  const appDir = path.join(process.cwd(), 'app');
  const apiDir = path.join(appDir, 'api');
  const authDir = path.join(appDir, 'auth');
  
  // Create backup directories
  const apiBackup = path.join(process.cwd(), 'app-api-backup');
  const authBackup = path.join(process.cwd(), 'app-auth-backup');
  
  // Copy and remove only problematic API routes (keep auth and qr APIs)
  if (fs.existsSync(apiDir)) {
    // Remove old backup
    if (fs.existsSync(apiBackup)) {
      fs.rmSync(apiBackup, { recursive: true, force: true });
    }
    
    // Copy to backup
    copyDirectory(apiDir, apiBackup);
    
    // Remove only problematic routes, keep auth and qr
    const routesToKeep = ['auth', 'health'];
    
    fs.readdirSync(apiDir).forEach(route => {
      if (!routesToKeep.includes(route)) {
        const routePath = path.join(apiDir, route);
        if (fs.existsSync(routePath)) {
          fs.rmSync(routePath, { recursive: true, force: true });
          console.log(`✓ Removed API route: ${route}`);
        }
      }
    });
    
    console.log('✓ Kept essential API routes (auth, health, qr)');
  }
  
  // Copy and remove auth directory (but keep the API routes)
  if (fs.existsSync(authDir)) {
    // Remove old backup
    if (fs.existsSync(authBackup)) {
      fs.rmSync(authBackup, { recursive: true, force: true });
    }
    
    // Copy to backup
    copyDirectory(authDir, authBackup);
    
    // Remove original (but keep /api/auth routes)
    fs.rmSync(authDir, { recursive: true, force: true });
    console.log('✓ Backed up and removed auth directory (kept /api/auth routes)');
  }
  
  // Ensure essential API routes exist
  const placeholderApiDir = path.join(appDir, 'api');
  
  // Health route (already exists)
  const healthDir = path.join(placeholderApiDir, 'health');
  if (!fs.existsSync(healthDir)) {
    fs.mkdirSync(healthDir, { recursive: true });
  }
  
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
  
  // QR API routes (create if they don't exist)
  const qrDir = path.join(placeholderApiDir, 'auth', 'qr');
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }
  
  // QR generate route
  const qrGenerateRoute = `// QR Code Generation API
export const dynamic = 'force-static';
export const revalidate = false;

export function generateStaticParams() {
  return [];
}

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { deviceInfo } = await request.json();
    
    // Generate session
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    const expiresIn = 300; // 5 minutes in seconds
    
    // Create auth URL
    const authUrl = \`galaxyspacecrafts://auth?session=\${sessionId}&device=\${encodeURIComponent(deviceInfo)}\`;
    
    return NextResponse.json({
      success: true,
      sessionId,
      qrData: sessionId,
      authUrl,
      expiresAt,
      expiresIn,
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}`;
  
  fs.writeFileSync(path.join(qrDir, 'generate', 'route.ts'), qrGenerateRoute);
  
  // QR check route
  const qrCheckRoute = `// QR Code Check API
export const dynamic = 'force-static';
export const revalidate = false;

export function generateStaticParams() {
  return [];
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      );
    }
    
    // Mock response for mobile - in production would check real session
    return NextResponse.json({
      status: 'pending',
      remainingTime: 300000, // 5 minutes
    });
  } catch (error) {
    console.error('QR check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check QR status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, action } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      );
    }
    
    if (action === 'scan') {
      return NextResponse.json({ success: true });
    } else if (action === 'confirm') {
      // Mock successful login
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('QR confirm error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to confirm QR' },
      { status: 500 }
    );
  }
}`;
  
  fs.writeFileSync(path.join(qrDir, 'check', 'route.ts'), qrCheckRoute);
  
  console.log('✓ Created essential API routes (health, auth/qr)');
};

// Copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Restore original directories
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
    copyDirectory(apiBackup, apiDir);
    console.log('✓ Restored API directory');
  }
  
  if (fs.existsSync(authBackup)) {
    copyDirectory(authBackup, authDir);
    console.log('✓ Restored auth directory');
  }
  
  // Clean up backups
  if (fs.existsSync(apiBackup)) {
    fs.rmSync(apiBackup, { recursive: true, force: true });
  }
  if (fs.existsSync(authBackup)) {
    fs.rmSync(authBackup, { recursive: true, force: true });
  }
};

// Run based on command line argument
const command = process.argv[2];
if (command === 'prepare') {
  prepareMobileBuild();
} else if (command === 'restore') {
  restoreOriginalBuild();
} else {
  console.log('Usage: node mobile-build-simple.js [prepare|restore]');
}
