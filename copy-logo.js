const fs = require('fs');
const path = require('path');

const src = '/Users/ltdinfyudha/.gemini/antigravity-ide/brain/edc84142-16dc-4c4f-8ae8-eea247bfe7a1/logo_p_plus_1784221465449.png';

try {
  fs.copyFileSync(src, '/Users/ltdinfyudha/Documents/PULIHKU/src/app/favicon.ico');
  fs.copyFileSync(src, '/Users/ltdinfyudha/Documents/PULIHKU/public/favicon.ico');

  const extImagesDir = '/Users/ltdinfyudha/Documents/PULIHKU/pulihku-extension/images';
  if (!fs.existsSync(extImagesDir)) {
    fs.mkdirSync(extImagesDir, { recursive: true });
  }

  fs.copyFileSync(src, path.join(extImagesDir, 'icon-16.png'));
  fs.copyFileSync(src, path.join(extImagesDir, 'icon-48.png'));
  fs.copyFileSync(src, path.join(extImagesDir, 'icon-128.png'));

  console.log('SUCCESS: All P+ logo icons successfully copied!');
} catch (err) {
  console.error('ERROR copying files:', err.message);
}
