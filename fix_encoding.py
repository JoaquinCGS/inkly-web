import glob

fixes = {
    'cotill\ufffdn': 'cotillón',
    'Cotill\ufffdn': 'Cotillón',
    'est\ufffds': 'estás',
    'Pi\ufffdata': 'Piñata',
    'peque\ufffdos': 'pequeños',
    'l\ufffdpiz': 'lápiz',
    'cl\ufffdsico': 'clásico',
    'Malet\ufffdn': 'Maletín',
    'P\ufffdgina': 'Página',
    'p\ufffdgina': 'página',
    'Im\ufffdn': 'Imán',
    'im\ufffdn': 'imán',
    'l\ufffdpices': 'lápices',
    'Marcap\ufffdginas': 'Marcapáginas',
    'libro2l\ufffdpicesbolsitaunitaria': 'libro2lapicesbolsitaunitaria',
    'L\ufffdmina': 'Lámina',
    'pir\ufffdmide': 'pirámide',
    'magn\ufffdtica': 'magnética',
    'cumplea\ufffdos': 'cumpleaños',
    'aplicaci\ufffdn': 'aplicación',
    'im\ufffdgenes': 'imágenes',
    '<span class="icon-sun">??</span>': '<span class="icon-sun">☀️</span>',
    '<span class="icon-moon">??</span>': '<span class="icon-moon">🌙</span>'
}

for fpath in glob.glob('*.html'):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for bad, good in fixes.items():
        content = content.replace(bad, good)
        
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
print('Fixed words')
