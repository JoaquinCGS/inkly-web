const fs = require('fs');
const path = require('path');

async function main() {
  const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.endsWith('.test'));
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Update Open Graph image
    content = content.replace(
      'content="assets/images/logo.webp"',
      'content="https://mundoinkly.cl/assets/images/logo.webp"'
    );
    
    // Inject manifest
    if (!content.includes('<link rel="manifest"')) {
      content = content.replace(
        '</title>',
        '</title>\n  <link rel="manifest" href="manifest.json" />'
      );
    }
    
    // Add lazy loading to images (simple regex for product grids, avoiding logo)
    // Only targeting via.placeholder.com or product images if possible.
    // Instead of risky regex for lazy loading on all images, let's just do it manually or skip if risky.
    // I noticed they already had loading="lazy" in bautizo.html, so maybe generate_pages handles it.
    
    fs.writeFileSync(file, content);
  }
  
  // also do generate_pages.py
  if (fs.existsSync('generate_pages.py')) {
    let pyContent = fs.readFileSync('generate_pages.py', 'utf8');
    pyContent = pyContent.replace(
      'content="assets/images/logo.webp"',
      'content="https://mundoinkly.cl/assets/images/logo.webp"'
    );
    if (!pyContent.includes('<link rel="manifest"')) {
      pyContent = pyContent.replace(
        '</title>',
        '</title>\\n  <link rel="manifest" href="manifest.json" />'
      );
    }
    fs.writeFileSync('generate_pages.py', pyContent);
  }
  
  console.log('Mass update completed.');
}
main();
