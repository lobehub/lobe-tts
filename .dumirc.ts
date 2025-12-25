import { defineConfig } from 'dumi';
import { SiteThemeConfig } from 'dumi-theme-lobehub';
import path from 'node:path';

import { description, homepage, name } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';
const isWin = process.platform === 'win32';

const themeConfig: SiteThemeConfig = {
  actions: [
    {
      github: true,
      link: homepage,
      openExternal: true,
      text: 'GitHub',
    },
    {
      link: '/components/use-speech-recognition',
      text: 'Get Started',
      type: 'primary',
    },
  ],
  analytics: {
    plausible: {
      domain: 'tts.lobehub.com',
      scriptBaseUrl: 'https://plausible.lobehub-inc.cn',
    },
  },
  apiHeader: {
    docUrl: `{github}/tree/master/src/{atomId}`,
    match: ['/components'],
    pkg: name,
    sourceUrl: `{github}/tree/master/src/{atomId}`,
  },
  description,
  giscus: {
    category: 'Q&A',
    categoryId: 'DIC_kwDOKoaTlM4Cin-0',
    repo: 'lobehub/lobe-tts',
    repoId: 'R_kgDOKoaTlA',
  },
  metadata: {
    openGraph: {
      image:
        'https://repository-images.githubusercontent.com/713462676/32967e56-249e-4593-bb18-b3ed34e69669',
    },
  },
  name: 'TTS',
  prefersColor: {
    default: 'dark',
    switch: false,
  },
  socialLinks: {
    discord: 'https://discord.gg/AYFPHvv2jT',
    github: homepage,
  },
  title: 'Lobe TTS',
};

export default defineConfig({
  alias: {
    '@lobehub/tts/react': path.join(__dirname, './src/react'),
    '@lobehub/tts/server': path.join(__dirname, './src/server'),
  },
  apiParser: isProduction ? {} : false,
  base: '/',
  define: {
    'process.env': process.env,
  },
  // exportStatic: {},
  extraBabelPlugins: ['antd-style'],
  favicons: ['https://lobehub.com/favicon.ico'],
  jsMinifier: 'swc',
  locales: [{ id: 'en-US', name: 'English' }],
  mako: isWin || isProduction ? false : {},
  npmClient: 'pnpm',
  publicPath: '/',
  resolve: {
    atomDirs: [{ dir: 'src/react', type: 'component' }],
    entryFile: isProduction ? './src/index.ts' : undefined,
  },
  sitemap: {
    hostname: 'https://tts.lobehub.com',
  },
  styles: [
    `html, body { background: transparent;  }

  @media (prefers-color-scheme: dark) {
    html, body { background: #000; }
  }`,
  ],
  themeConfig,
  title: 'Lobe TTS',
});
