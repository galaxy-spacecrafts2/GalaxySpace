const fs = require('fs');
const path = require('path');

// This script adds static export configuration to all API routes
const addStaticExports = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      addStaticExports(fullPath);
    } else if (file.name === 'route.ts' || file.name === 'route.js') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if static exports already exist
      if (!content.includes('export const dynamic')) {
        // Add static exports at the beginning of the file
        const staticExports = `// Static export configuration
export const dynamic = 'force-static';
export const revalidate = false;

`;
        
        // Insert after imports or at the beginning
        const importRegex = /^import[^;]+;/gm;
        const imports = content.match(importRegex);
        
        if (imports && imports.length > 0) {
          const lastImport = imports[imports.length - 1];
          const lastIndex = content.lastIndexOf(lastImport) + lastImport.length;
          content = content.slice(0, lastIndex) + '\n\n' + staticExports + content.slice(lastIndex + 1);
        } else {
          content = staticExports + content;
        }
        
        fs.writeFileSync(fullPath, content);
        console.log(`✓ Added static exports to ${fullPath}`);
      }
    }
  });
};

// Run the script
const appDir = path.join(process.cwd(), 'app');
addStaticExports(appDir);
