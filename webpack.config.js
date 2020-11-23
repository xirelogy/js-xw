const config = {};
const path = require('path');

function generateConfig(name) {
    const uglify = name.indexOf('min') > -1;
    return {
        entry: './index.js',
        mode: process.env.NODE_ENV,
        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: name + '.js',
            sourceMapFilename: name + '.map',
            library: 'xirelogy-xw',
            libraryTarget: 'umd'
        },
        devtool: 'source-map',
        optimization: {
            minimize: uglify
        }
    };
}

['xirelogy-xw', 'xirelogy-xw.min'].forEach(function (key) {
    config[key] = generateConfig(key);
});

module.exports = config;
