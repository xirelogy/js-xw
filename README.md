# The XW Javascript framework

### Introduction

XW is a simple Javascript framework that collect common utilities together. Focus including:

- Internationalization (i18n) that is highly extensible built in the core.
- Promise-based asynchronous support whenever needed.

The framework is written mostly with ES6 in mind, but the distribution will run on ES5 compliant browsers.

### Using from npm

- XW is available from NPM:
  ```
  npm install @xirelogy/xw
  ```
- And you may start using by importing it into your script:
  ```
  import Xw from '@xirelogy/xw'
  ```
  or
  ```
  const Xw = require('@xirelogy/xw').default
  ```
  
### Using from script

- Script can be built staticly from the project:
  ```
  npm run build
  ```
- The resulting `xirelogy-xw.js` and `xirelogy-xw.min.js` can be found in the `dist` folder,
  correspond to the normal version and the minimized version.
  
### Documentation

- The entire library is heavily documented, and documentation can be generated using JSDoc:
  ```
  jsdoc -c jsdoc.json
  ```
- The resulting documentation can be accessed from `docs/index.html`.