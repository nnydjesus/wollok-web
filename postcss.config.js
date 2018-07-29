var path = require('path');

module.exports = {
  plugins: [
    require('postcss-mixins')(),
    require('postcss-each')(),
    require('postcss-preset-env')(),
    require('postcss-reporter')({ clearMessages: true })
  ]
};