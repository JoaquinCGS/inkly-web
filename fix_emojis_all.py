import os
import glob

directory = r"c:\Users\juako\.gemini\antigravity\scratch\inkly-website"
html_files = glob.glob(os.path.join(directory, "*.html"))

svg_sun = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
svg_moon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'

theme_toggle_svg = f'<span class="icon-sun">{svg_sun}</span>\n          <span class="icon-moon">{svg_moon}</span>'

for file in html_files:
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file}: {e}")
        continue

    # Fix theme toggle (handling different variants of corruption)
    content = content.replace('<span class="icon-sun">??</span><span class="icon-moon">??</span>', theme_toggle_svg)
    content = content.replace('<span class="icon-sun">☀️ </span><span class="icon-moon">🌙</span>', theme_toggle_svg)
    content = content.replace('<span class="icon-sun">â˜€ï¸ </span><span class="icon-moon">ðŸŒ™</span>', theme_toggle_svg)

    # Fix cart icon
    content = content.replace('<span class="cart-icon">???</span>', '<span class="cart-icon">🛍️</span>')
    content = content.replace('<span class="cart-icon">ðŸ› ï¸ </span>', '<span class="cart-icon">🛍️</span>')

    # Fix marquee emojis
    content = content.replace('? Diseños 100% Personalizados', '✨ Diseños 100% Personalizados')
    content = content.replace('? Envíos a todo Chile', '✨ Envíos a todo Chile')
    content = content.replace('? Hecho a mano con amor', '✨ Hecho a mano con amor')
    content = content.replace('? Cotillón Exclusivo', '✨ Cotillón Exclusivo')

    # Fix copyright symbol if corrupted
    content = content.replace('Â©', '©')

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Fixed {file}")
