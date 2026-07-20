const fs = require('fs');

let css = fs.readFileSync('assets/css/style.css', 'utf8');

// Change opacity in variables
css = css.replace(/--color-nav-bg: oklch\(98\.5% 0\.005 350 \/ 0\.95\);/g, '--color-nav-bg: oklch(98.5% 0.005 350 / 0.65);');
css = css.replace(/--color-nav-bg: oklch\(20% 0\.01 350 \/ 0\.95\);/g, '--color-nav-bg: oklch(20% 0.01 350 / 0.65);');

// Change blur in .navbar
css = css.replace(/backdrop-filter: blur\(8px\);/g, 'backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);');

// Change cart drawer background and add blur
css = css.replace(/\.cart-drawer \{\s*position: fixed;\s*top: 0;\s*right: -400px;\s*width: 100%;\s*max-width: 400px;\s*height: 100vh;\s*background: var\(--color-bg\);/g, 
`.cart-drawer {
  position: fixed;
  top: 0;
  right: -400px;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: var(--color-nav-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);`);

fs.writeFileSync('assets/css/style.css', css);
console.log('CSS modified for glassmorphism.');
