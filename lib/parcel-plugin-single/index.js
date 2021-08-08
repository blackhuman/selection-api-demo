const fs = require('fs');
const path = require('path');

module.exports = bundler => {
  bundler.on("bundled", bundle => {
    const outDir = bundler.options.outDir;
    const jsBundle = bundle;
    const cssBundle = bundle.siblingBundlesMap.get('css');
    let jsContent = fs.readFileSync(jsBundle.name);
    const cssContent = fs.readFileSync(cssBundle.name);
    console.log(jsBundle.name);
    console.log(cssBundle.name);
    jsContent += `
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(\`${cssContent}\`));
    `;
    const singleBundlePath = path.join(outDir, 'single.js');
    fs.writeFileSync(singleBundlePath, jsContent);
    console.log(path.relative(process.cwd(), singleBundlePath));
  })
}
