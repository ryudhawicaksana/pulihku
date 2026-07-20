const { execSync } = require('child_process');
try {
  execSync('zip -r public/pulihku-extension.zip pulihku-extension');
  console.log('SUCCESS: Extension zipped successfully into public/pulihku-extension.zip!');
} catch (err) {
  console.error('ERROR zipping:', err.message);
}
