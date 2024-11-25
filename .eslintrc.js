const config = require('@lobehub/lint').eslint;

config.rules['no-param-reassign'] = 0;
config.rules['unicorn/no-array-callback-reference'] = 0;
config.rules['unicorn/no-array-for-each'] = 0;
config.rules['unicorn/no-useless-undefined'] = 0;

module.exports = config;
