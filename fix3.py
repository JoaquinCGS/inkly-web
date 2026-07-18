import glob

replacements = {
    'Ã¡': 'á', 'Ã©': 'é', 'Ã³': 'ó', 'Ã­': 'í', 'Ãº': 'ú',
    'Ã±': 'ñ', 'Ã‘': 'Ñ', 'Â¿': '¿', 'Â¡': '¡', 'â€“': '–',
    'ðŸ› ï¸ ': '🛍️', 'ðŸ🍪': '🍪', 'Ã ': 'Á', 'Ã‰': 'É', 'Ã“': 'Ó', 'Ã ': 'Í', 'Ãš': 'Ú',
    'â˜€ï¸ ': '☀️', 'ðŸŒ™': '🌙', 'MenÃº': 'Menú', 'CatÃ¡logo': 'Catálogo', 'CÃ³mo': 'Cómo',
    'decoraciÃ³n': 'decoración', 'DiseÃ±os': 'Diseños', 'EnvÃ­os': 'Envíos'
}

for file in glob.glob('*.html') + glob.glob('assets/js/*.js') + glob.glob('assets/css/*.css'):
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for k, v in replacements.items():
            content = content.replace(k, v)
            
        with open(file, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
    except Exception as e:
        print(f'Error in {file}: {e}')

print('Fixed encoding for all files')
