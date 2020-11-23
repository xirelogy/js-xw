const fs = require('fs');

let writeData = '';
writeData += 'import i18nSetup from "../src/XwI18nSetup";\n\n';

const locales = fs.readdirSync('locales');
for (const locale of locales) {
    const files = fs.readdirSync('locales/' + locale);
    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const className = file.substr(0, file.length - 5);
        console.log('Got \'' + locale + '\' for \'' + className + '\'');

        const filename = 'locales/' + locale + '/' + file;
        const readContent = fs.readFileSync(filename).toString();
        writeData += 'i18nSetup.define(\'' + className + '\',\'' + locale + '\',' + readContent.trim() + ');\n';
    }
}

writeData += '\n';
writeData += 'const _dummy = null;\n';
writeData += 'export default _dummy;\n';

const outFilename = 'gen/locales.js';
console.log('Writing to: ' + outFilename);
fs.writeFileSync(outFilename, writeData);