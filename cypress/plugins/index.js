const webpack = require('@cypress/webpack-preprocessor');

module.exports = on => {
  const options = {
    webpackOptions: require('./webpack.config.js'),
    watch: {}
  };

  on('file:preprocessor', webpack(options));
}
