const fs = require('fs');
const path = require('path');

module.exports = bundler => {
  bundler.on("bundled", bundle => {
    const jsBundle = bundle;
    const cssBundle = bundle.siblingBundlesMap.get('css');
    let jsContent = fs.readFileSync(jsBundle.name);
    const cssContent = fs.readFileSync(cssBundle.name);
    jsContent += `
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(\`${cssContent}\`));
    `;
    fs.writeFileSync(path.join(bundler.options.outDir, 'single.js'), jsContent);
  })
}
