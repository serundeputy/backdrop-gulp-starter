/* eslint-env node */
'use strict';

var options = {
  // Patterns for PHP files to lint and check.
  phpCheck: ['{modules,themes}/custom/**/*.{php,inc,module,theme,inc,install}'],
  // Patterns for JS files to lint and check.
  jsCheck: [
    'gulpfile.js',
    'gulpconfig.js',
    '{modules,themes}/custom/**/*.js',
    '!{modules,themes}/custom/**/bower_components/**',
    '!{modules,themes}/custom/**/node_modules/**',
    '!{modules,themes}/custom/**/dist/**'
  ]
};

module.exports = options;
