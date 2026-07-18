const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/juako/.gemini/antigravity/scratch/inkly-website';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'catalog.html');

let products = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  // Regex to match: <img src="assets/images/X" ... /> ... <h3>Y</h3>
  const regex = /<img src="(.*?)"[\s\S]*?<h3>(.*?)<\/h3>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    // Only match if it's inside a .card
    products.push({
      title: match[2].trim(),
      image: match[1],
      url: f
    });
  }
});

fs.writeFileSync(path.join(dir, 'products.json'), JSON.stringify(products, null, 2));
console.log('Extracted ' + products.length + ' products.');
