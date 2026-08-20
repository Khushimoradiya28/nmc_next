const fs = require('fs');
const html = fs.readFileSync('temp_sections.html', 'utf8');
const file = 'about.html';
let content = fs.readFileSync(file, 'utf8');
const target = '  <footer class="footer" id="quick-links">';
content = content.replace(target, html + '\n' + target);
fs.writeFileSync(file, content, 'utf8');
console.log('done');
