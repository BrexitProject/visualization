let webpack = require('webpack')
let path = require('path')

module.exports = {
    target: "node",
    entry: path.join(__dirname,'./index.js'),
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname,'./build'),
    }
}