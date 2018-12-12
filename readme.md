# Easy Import

A package-like importer for JavaScript and Babel.

## Installation

1. `npm install --save-dev easy-import`
1. `"plugins": ["easy-import"]` - `.babelrc` options

### Options

1. `from` - folder you are building your files from
1. `to` - folder you are building your files to
1. `directories` - directories to traverse to find packages

`"plugins": [["easy-import", {
  "from": "src",
  "to": "dist",
  "directories": ["src", "test"]
}]]`

## Example

`./src/packages/math.js`
```javascript
// @package Math

const main = Math;
const multiply = (a, b, c) => a * b * c;
const sum = (a, b, c) => a + b + c;

export default main;
export {
  multiply,
  sum,
};
```
`./src/controllers/anything.js`
```javascript
import math, { multiply, sum } from 'Math';
// or import * as math from 'Math'
// or import { multiply } from 'Math'
console.log(multiply(1, 2, 3), sum(1, 2, 3), math.min(100, 200));
```