import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dist = path.join(root, 'dist');

const skip = new Set(['.git', '.netlify', 'node_modules', 'dist', 'scripts']);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      if (skip.has(entry)) continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

for (const entry of fs.readdirSync(root)) {
  if (skip.has(entry)) continue;
  copyRecursive(path.join(root, entry), path.join(dist, entry));
}

console.log('✅ Build concluído em dist/');
