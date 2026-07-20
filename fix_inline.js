const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f === 'generate_pages.py');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace Analytics inline script
  const analyticsRegex = /<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-V15F1C2BH5'\);\s*<\/script>/g;
  content = content.replace(analyticsRegex, '<script src="assets/js/analytics.js"></script>');

  // Replace Theme Init inline script
  const themeRegex = /<script>\s*const savedTheme = localStorage\.getItem\('theme'\);\s*if \(savedTheme === 'dark' \|\| \(\!savedTheme && window\.matchMedia\('\(prefers-color-scheme: dark\)'\)\.matches\)\) \{\s*document\.documentElement\.setAttribute\('data-theme', 'dark'\);\s*\}\s*<\/script>/g;
  content = content.replace(themeRegex, '<script src="assets/js/theme-init.js"></script>');

  fs.writeFileSync(file, content);
}
console.log('Inline scripts replaced.');
