import fs from 'fs';
import path from 'path';

console.log('\n🔍 ========================================================');
console.log('🔍 ASSET DIAGNOSTIC: Verifying public folder contents in dist');
console.log('🔍 ========================================================\n');

const publicDir = path.join(process.cwd(), 'public');
const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(publicDir)) {
  console.log('⚠️  No "public" directory found. Skipping check.');
  console.log('💡 TIP: If you added images, they must be placed inside a folder named "public" at the root of your project to be deployed to Vercel.');
  process.exit(0);
}

if (!fs.existsSync(distDir)) {
  console.error('❌ Error: "dist" directory not found. Build may have failed.');
  process.exit(1);
}

function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

const publicFiles = getFilesRecursively(publicDir);
let missingFiles = 0;
let successCount = 0;

console.log(`Found ${publicFiles.length} files in public folder. Verifying they exist in dist...\n`);

publicFiles.forEach(publicFilePath => {
  // Get the relative path from the public directory
  const relativePath = path.relative(publicDir, publicFilePath);
  
  // Vite copies public/* directly to the root of dist/
  const expectedDistPath = path.join(distDir, relativePath);
  
  if (fs.existsSync(expectedDistPath)) {
    const stats = fs.statSync(expectedDistPath);
    console.log(`✅ SUCCESS: ${relativePath} (${(stats.size / 1024).toFixed(2)} KB) -> Successfully copied to dist`);
    successCount++;
  } else {
    console.error(`❌ FAILED: ${relativePath} -> MISSING from dist!`);
    missingFiles++;
  }
});

console.log('\n📊 Diagnostic Summary:');
console.log(`- Files verified successfully: ${successCount}`);
if (missingFiles > 0) {
  console.error(`- Files missing from dist: ${missingFiles}`);
  console.log('\n⚠️ If images are missing on Vercel, ensure they were successfully pushed to your GitHub repository.');
} else {
  console.log('- Files missing from dist: 0');
  console.log('\n🚀 All public assets successfully transferred to the build folder!');
}
console.log('\n========================================================\n');
