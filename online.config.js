let path = require('path');

module.exports = {
  entry: './views/public/bubble_online.js',
  output: {
    path: path.join(__dirname,'./views/public'),
    filename: 'bubble_online_bundle.js',
  },
};