const fs = require('fs');

const htmlAnalytics = `<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-V15F1C2BH5');
  </script>`;
const pyAnalytics = `<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-V15F1C2BH5');
  </script>`;

const htmlVa = `<script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>`;
const pyVa = `<script>
    window.va = window.va || function () {{ (window.vaq = window.vaq || []).push(arguments); }};
  </script>`;

const themeInit = `<script>
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  </script>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f === 'generate_pages.py');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (file === 'generate_pages.py') {
    content = content.replace(pyAnalytics, '<script src="assets/js/analytics.js"></script>');
    content = content.replace(pyVa, '<script src="assets/js/va-init.js"></script>');
  } else {
    // HTML files
    // the previous script fix_inline.js already replaced analytics and theme in html files
    // but missed va-init
    // Let's just do a string replace, ignoring whitespace might be tricky, so we do naive match
    // Actually, I can just use a regex that matches the content loosely
  }

  // Let's use loose regexes that work for both html and python
  content = content.replace(/<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{\{?dataLayer\.push\(arguments\);\}\}?\s*gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-V15F1C2BH5'\);\s*<\/script>/g, '<script src="assets/js/analytics.js"></script>');

  content = content.replace(/<script>\s*window\.va = window\.va \|\| function \(\) \{\{? \(window\.vaq = window\.vaq \|\| \[\]\)\.push\(arguments\); \}\}?;\s*<\/script>/g, '<script src="assets/js/va-init.js"></script>');

  content = content.replace(/<script>\s*const savedTheme = localStorage\.getItem\('theme'\);\s*if \(savedTheme === 'dark' \|\| \(\!savedTheme && window\.matchMedia\('\(prefers-color-scheme: dark\)'\)\.matches\)\) \{\s*document\.documentElement\.setAttribute\('data-theme', 'dark'\);\s*\}\s*<\/script>/g, '<script src="assets/js/theme-init.js"></script>');

  fs.writeFileSync(file, content);
}
console.log('Done replacing inline scripts');
