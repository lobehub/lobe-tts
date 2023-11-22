/**
 *
 * @type {import("@lobehub/i18n-cli").Config}
 */
module.exports = {
  markdown: {
    entry: ['docs/**/**'],
    entryLocale: 'zh-CN',
    entryExtension: '.zh-CN.md',
    exclude: ['changelog.md'],
    outputLocales: ['en-US'],
    outputExtensions: (locale, { getDefaultExtension }) => {
      if (locale === 'en-US') return '.md';
      return getDefaultExtension(locale);
    },
  },
  modelName: 'gpt-3.5-turbo-1106',
};
