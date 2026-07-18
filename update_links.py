import glob
for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content.replace('<a href="index.html#contacto" class="nav-item">Contacto</a>', '<a href="index.html#faq" class="nav-item">Preguntas Frecuentes</a>')
    
    if content != new_content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print('Updated', f)
