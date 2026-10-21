import { defineDocsConfig } from '@lobehub/docs-kit/src/config';

export default defineDocsConfig({
  alias: {
    '@': 'src',
    '@lobehub/tts': 'src',
  },
  atomDirs: [{ dir: 'src/react', subType: 'components', type: 'component' }],
  description:
    'Text-to-speech and speech-to-text for server and browser, with React hooks and audio components.',
  favicons: {
    icon: 'https://lobehub.com/favicon.ico',
  },
  homePage: './docs/home/home.tsx',
  navSections: {},
  publicDocs: [
    'docs/api-reference/index.mdx',
    'docs/api-reference/edge-speech-tts.mdx',
    'docs/api-reference/microsoft-speech-tts.mdx',
    'docs/api-reference/openai-tts.mdx',
  ],
  siteUrl: 'https://tts.lobehub.com',
  themeConfig: {
    analytics: {
      plausible: {
        domain: 'tts.lobehub.com',
        source: 'https://plausible.lobehub-inc.cn/js/script.js',
      },
    },
    apiHeader: {
      docUrl: '{github}/edit/master/{atomId}',
      github: 'https://github.com/lobehub/lobe-tts',
      match: ['/components/'],
      packageName: '@lobehub/tts',
      packageNames: { components: '@lobehub/tts/react' },
      sourceUrl: '{github}/tree/master/{atomId}',
    },
    giscus: {
      category: 'Q&A',
      categoryId: 'DIC_kwDOKoaTlM4Cin-0',
      repo: 'lobehub/lobe-tts',
      repoId: 'R_kgDOKoaTlA',
    },
    metadata: {
      openGraph: {
        image:
          'https://repository-images.githubusercontent.com/713462676/d13d3fda-9c5d-457c-a816-4c333cc96363',
      },
    },
    navItems: [
      { external: true, href: 'https://ui.lobehub.com', label: 'UI' },
      { external: true, href: 'https://icons.lobehub.com', label: 'Icons' },
      { href: '/api-reference', icon: 'book-open', label: 'API Reference' },
      { href: '/changelog', label: 'Changelog' },
    ],
    prefersColor: 'auto',
    socialLinks: [
      {
        href: 'https://github.com/lobehub/lobe-tts',
        icon: 'github',
        label: 'GitHub',
      },
      { href: 'https://discord.gg/AYFPHvv2jT', icon: 'discord', label: 'Discord' },
      {
        href: 'https://www.npmjs.com/package/@lobehub/tts',
        icon: 'npm',
        label: 'NPM',
      },
    ],
  },
  title: 'Lobe TTS',
});
