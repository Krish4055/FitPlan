// Verify build script for Render
import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying build...');

const serverPublicPath = path.resolve(process.cwd(), 'server', 'public');
const indexHtmlPath = path.resolve(serverPublicPath, 'index.html');

console.log('📁 Checking server/public directory...');
console.log('Path:', serverPublicPath);

if (fs.existsSync(serverPublicPath)) {
  console.log('✅ server/public directory exists');
  
  const files = fs.readdirSync(serverPublicPath);
  console.log('📄 Files in server/public:', files);
  
  if (fs.existsSync(indexHtmlPath)) {
    console.log('✅ index.html exists');
  } else {
    console.log('❌ index.html not found');
    process.exit(1);
  }
} else {
  console.log('❌ server/public directory not found');
  console.log('Creating directory...');
  fs.mkdirSync(serverPublicPath, { recursive: true });
  console.log('✅ Created server/public directory');
}

console.log('🎉 Build verification complete!'); 