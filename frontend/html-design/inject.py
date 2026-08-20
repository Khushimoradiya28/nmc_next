import os

with open('temp_sections.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('about.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = '  <footer class="footer" id="quick-links">'
content = content.replace(target, html + '\n' + target)

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('done')
