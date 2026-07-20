const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function getSRI(url) {
  const res = await fetch(url);
  const text = await res.text();
  const hash = crypto.createHash('sha384').update(text).digest('base64');
  return 'sha384-' + hash;
}

async function main() {
  console.log('Fetching GSAP 3.12.2 hashes...');
  const gsapHash = await getSRI('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
  const scrollTriggerHash = await getSRI('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
  console.log('GSAP:', gsapHash);
  console.log('ScrollTrigger:', scrollTriggerHash);

  const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.endsWith('.test'));
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add SRI to GSAP scripts
    content = content.replace(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>',
      `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" integrity="${gsapHash}" crossorigin="anonymous"></script>`
    );
    content = content.replace(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>',
      `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" integrity="${scrollTriggerHash}" crossorigin="anonymous"></script>`
    );

    // Add rel="noopener noreferrer" to target="_blank"
    content = content.replace(/target="_blank"(?!\s*rel=)/g, 'target="_blank" rel="noopener noreferrer"');
    
    fs.writeFileSync(file, content);
  }
  
  // also do generate_pages.py since it has template literals that build HTML pages
  if (fs.existsSync('generate_pages.py')) {
    let pyContent = fs.readFileSync('generate_pages.py', 'utf8');
    pyContent = pyContent.replace(/target="_blank"(?!\s*rel=)/g, 'target="_blank" rel="noopener noreferrer"');
    fs.writeFileSync('generate_pages.py', pyContent);
  }
  
  console.log('Done replacing in HTML files.');
}
main();
