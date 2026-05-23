import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = '/Users/rohitphotogarphy/Projects/My Habit Tracker/elite-resources';
process.chdir(ROOT);

console.log('🏗️ Building project...');
execSync('npm run build', { stdio: 'inherit' });

const distPath = path.join(ROOT, 'dist');

// Remove devhub from build output so it is not deployed
const devhubDistPath = path.join(distPath, 'devhub');
if (fs.existsSync(devhubDistPath)) {
  console.log('🧹 Removing devhub from build output prior to deployment...');
  fs.rmSync(devhubDistPath, { recursive: true, force: true });
}

process.chdir(distPath);

console.log('🧹 Initializing git in dist folder...');
if (fs.existsSync('.git')) {
  fs.rmSync('.git', { recursive: true, force: true });
}

execSync('git init', { stdio: 'inherit' });
execSync('git checkout -b gh-pages', { stdio: 'inherit' });
execSync('git add .', { stdio: 'inherit' });
execSync('git commit -m "deploy: publish build to GitHub Pages"', { stdio: 'inherit' });

console.log('🚀 Pushing to gh-pages branch...');
execSync('git remote add origin https://github.com/poppingpixel/elite-resources.git', { stdio: 'inherit' });
execSync('git push origin gh-pages --force', { stdio: 'inherit' });

console.log('\n🎉 Deployment pushed successfully!');
