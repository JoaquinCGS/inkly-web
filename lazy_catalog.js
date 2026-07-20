const fs = require('fs');

let content = fs.readFileSync('catalog.html', 'utf8');
content = content.replace(/<img src="assets\/images\/[^"]+" alt="[^"]+" \/>/g, (match) => {
  return match.replace('/>', 'loading="lazy" />');
});

fs.writeFileSync('catalog.html', content);
console.log('Lazy load added to catalog.html');
