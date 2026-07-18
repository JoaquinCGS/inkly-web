import glob

def fix_mojibake(text):
    # Fix the classic latin1 -> utf8 double encoding
    try:
        # If the whole text can be encoded as latin-1 and then decoded as utf-8, do it.
        # But this is risky if some parts are already correct UTF-8.
        pass
    except:
        pass
        
    replacements = {
        'â˜€ï¸ ': '☀️',
        'â˜€ï¸': '☀️',
        'â˜€': '☀️', # Fallback
        'âœ¨': '✨',
        'â€œ': '“',
        'â€': '”',
        'Ã¡': 'á', 'Ã©': 'é', 'Ã³': 'ó', 'Ã­': 'í', 'Ãº': 'ú',
        'Ã±': 'ñ', 'Ã‘': 'Ñ', 'Â¿': '¿', 'Â¡': '¡', 'â€“': '–',
        'ðŸ› ï¸ ': '🛍️', 'ðŸ🍪': '🍪', 'Ã ': 'Á', 'Ã‰': 'É', 'Ã“': 'Ó', 'Ã ': 'Í', 'Ãš': 'Ú',
        'CatÃ¡logo': 'Catálogo', 'CÃ³mo': 'Cómo'
    }
    
    # We first replace the multi-char ones
    for bad, good in replacements.items():
        text = text.replace(bad, good)
        
    # Also explicitly fix the sun if it still has trailing variation selectors
    text = text.replace('☀️ï¸', '☀️')
    text = text.replace('☀️\xef\xb8\x8f', '☀️')

    return text

for file in glob.glob('*.html') + glob.glob('assets/js/*.js') + glob.glob('assets/css/*.css'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    fixed = fix_mojibake(content)
    
    if fixed != content:
        with open(file, 'w', encoding='utf-8', newline='\n') as f:
            f.write(fixed)
        print(f'Fixed {file}')
