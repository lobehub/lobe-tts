const config = require('@lobehub/lint').eslint;
const { restrictedImports } = require('./node_modules/@lobehub/ui/es/eslint/index.mjs');

config.rules['no-param-reassign'] = 0;
config.rules['unicorn/no-array-callback-reference'] = 0;
config.rules['unicorn/no-array-for-each'] = 0;
config.rules['unicorn/no-useless-undefined'] = 0;

// ESLint 8 keys `paths` by module name, so a second `antd` entry would overwrite the first.
const [level, options] = restrictedImports.rules['no-restricted-imports'];
const paths = Object.values(
  options.paths.reduce((acc, path) => {
    const prev = acc[path.name];
    acc[path.name] =
      prev?.importNames && path.importNames
        ? { ...prev, importNames: [...prev.importNames, ...path.importNames] }
        : path;
    return acc;
  }, {}),
);
config.rules['no-restricted-imports'] = [level, { ...options, paths }];

module.exports = config;
