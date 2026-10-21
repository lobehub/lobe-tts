<div align="center"><a name="readme-top"></a>

<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-logo/assets/logo-3d.webp">
<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-logo/assets/split.svg">
<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-emoji/assets/microphone.webp">

<h1>Lobe TTS</h1>

<h3>Give your app a voice, and ears.</h3>

Text-to-speech and speech-to-text for server and browser, with React hooks and audio components.

[![][npm-release-shield]][npm-release-link]
[![][github-releasedate-shield]][github-releasedate-link]
[![][github-action-test-shield]][github-action-test-link]
[![][github-action-release-shield]][github-action-release-link]<br/>
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]<br/>
[![][sponsor-shield]][sponsor-link]

[Documents](https://tts.lobehub.com) · [Changelog](./CHANGELOG.md) · [Report Bug][github-issues-link] · [Request Feature][github-issues-link]

![](https://github-production-user-asset-6210df.s3.amazonaws.com/17870709/284077909-854cc09a-b3c7-4fc4-9ea7-f7137abba351.png)

</div>

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [✨ Why Lobe TTS?](#-why-lobe-tts)
- [🚀 Getting Started](#-getting-started)
  - [Generate speech on the server](#generate-speech-on-the-server)
  - [Play speech in React](#play-speech-in-react)
- [🤖 AI-Powered Development](#-ai-powered-development)
- [📦 Packages](#-packages)
- [📖 Documentation](#-documentation)
- [⌨️ Local Development](#️-local-development)
- [🤝 Contributing](#-contributing)
- [🩷 Sponsor](#-sponsor)
- [🔗 Links](#-links)

####

</details>

## ✨ Why Lobe TTS?

Lobe TTS (`@lobehub/tts`) lets you add natural-sounding speech output and voice input to your app, on the server or in the browser, in a few lines of TypeScript. It powers the voice features of [🤯 LobeHub](https://github.com/lobehub/lobehub).

- **Speak and listen** — turn text into speech and speech into text with one library
- **Pick your voice provider** — Microsoft Edge, Microsoft Speech, OpenAI or the browser's built-in speech, behind the same simple API
- **Server or browser** — generate audio files in Node.js / Bun, or speak directly in the user's browser
- **React-ready** — drop-in hooks and an audio player with progress, pause and download, so you don't build playback yourself
- **Smooth long-form playback** — long text starts playing quickly instead of waiting for the whole audio
- **AI-native** — [`skills.md`][skills-md-link] and [`llms.txt`][llms-txt-link] let your coding agent use the real API instead of guessing

## 🚀 Getting Started

> \[!IMPORTANT]\
> This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```bash
$ pnpm i @lobehub/tts
```

The React entry `@lobehub/tts/react` also needs the peer dependencies `@lobehub/ui@^6`, `react@^19` and `react-dom@^19`.

### Generate speech on the server

```js
// index.js — run with `bun index.js`
import { EdgeSpeechTTS } from '@lobehub/tts';
import fs from 'node:fs';

const tts = new EdgeSpeechTTS({ locale: 'en-US' });

const response = await tts.create({
  input: 'This is a speech demonstration',
  options: { voice: 'en-US-GuyNeural' },
});

fs.writeFileSync('./speech.mp3', Buffer.from(await response.arrayBuffer()));
```

> \[!NOTE]\
> Edge Speech needs a global `WebSocket`. It is built into Bun and Node.js 22+; on older Node.js versions, set `global.WebSocket` from the `ws` package.

### Play speech in React

```tsx
import { AudioPlayer, useEdgeSpeech } from '@lobehub/tts/react';
import { Button, Flexbox } from '@lobehub/ui';

export default () => {
  const { isGlobalLoading, start, stop, audio } = useEdgeSpeech('Hello from Lobe TTS', {
    options: { voice: 'en-US-GuyNeural' },
  });

  return (
    <Flexbox gap={8}>
      <Button loading={isGlobalLoading} onClick={isGlobalLoading ? stop : start}>
        Speak
      </Button>
      <AudioPlayer audio={audio} isLoading={isGlobalLoading} onLoadingStop={stop} />
    </Flexbox>
  );
};
```

Using Next.js? Add `transpilePackages: ['@lobehub/tts']` to `next.config.js`. For other providers, speech-to-text and more examples, see the [documentation](https://tts.lobehub.com).

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤖 AI-Powered Development

Lobe TTS publishes agent-friendly docs, so your AI assistant can write code against the documented API.

| Resource         | What it does                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| **Agent Skills** | [`tts.lobehub.com/skills.md`][skills-md-link] — skill entry point with setup, workflow and an index of the docs |
| **llms.txt**     | [`tts.lobehub.com/llms.txt`][llms-txt-link] — an [llms.txt](https://llmstxt.org) index of every docs page       |

Paste this into Cursor, Claude Code, Codex or any agent that can fetch URLs:

```text
Read https://tts.lobehub.com/skills.md, then use @lobehub/tts to add a "read aloud" button to my React app.
```

Works with **Cursor**, **Claude Code**, **Windsurf**, **GitHub Copilot** and other tools that read `skills.md` or `llms.txt`.

## 📦 Packages

| Entry                 | Use it for                                                    |
| --------------------- | ------------------------------------------------------------- |
| `@lobehub/tts`        | Generate speech or transcribe audio, on the server or browser |
| `@lobehub/tts/server` | Proxy OpenAI speech and transcription from your own API route |
| `@lobehub/tts/react`  | React hooks and audio player components                       |

## 📖 Documentation

Visit [tts.lobehub.com](https://tts.lobehub.com) for guides, API reference and live demos. See the [Changelog](./CHANGELOG.md) for release notes.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ Local Development

You can use Github Codespaces for online development:

[![][github-codespace-shield]][github-codespace-link]

Or clone it for local development:

```bash
$ git clone https://github.com/lobehub/lobe-tts.git
$ cd lobe-tts
$ bun install
$ bun run docs:dev
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤝 Contributing

Contributions of all types are more than welcome, if you are interested in contributing code, feel free to check out our GitHub [Issues][github-issues-link] to get stuck in to show us what you’re made of.

[![][pr-welcome-shield]][pr-welcome-link]

[![][github-contrib-shield]][github-contrib-link]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🩷 Sponsor

Every bit counts and your one-time donation sparkles in our galaxy of support! You're a shooting star, making a swift and bright impact on our journey. Thank you for believing in us – your generosity guides us toward our mission, one brilliant flash at a time.

<a href="https://opencollective.com/lobehub" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/lobehub/.github/blob/main/static/sponsor-dark.png?raw=true">
    <img  src="https://github.com/lobehub/.github/blob/main/static/sponsor-light.png?raw=true">
  </picture>
</a>

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🔗 Links

- **[🤯 Lobe UI][lobe-ui-link]** - React component library for AI applications
- **[🌈 Lobe Icons][lobe-icons-link]** - AI / LLM brand logos and icon library
- **[📊 Lobe Charts][lobe-charts-link]** - React chart component library
- **[✒️ Lobe Editor][lobe-editor-link]** - Lexical-based rich text editor for React, with Markdown, plugins and a chat composer
- **[🗣️ Lobe TTS][lobe-tts-link]** - TTS / STT speech library
- **[📐 Lobe Lint][lobe-lint-link]** - ESLint, Prettier, Stylelint, Commitlint and more lint configs
- **[😊 Fluent Emoji][fluent-emoji-link]** - Fluent Emoji asset library

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

#### 📝 License

Copyright © 2023 [LobeHub][profile-link]. <br />
This project is [MIT](./LICENSE) licensed.

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-black?style=flat-square
[fluent-emoji-link]: https://github.com/lobehub/fluent-emoji
[github-action-release-link]: https://github.com/lobehub/lobe-tts/actions/workflows/release.yml
[github-action-release-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/lobe-tts/release.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-action-test-link]: https://github.com/lobehub/lobe-tts/actions/workflows/test.yml
[github-action-test-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/lobe-tts/test.yml?label=test&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-codespace-link]: https://codespaces.new/lobehub/lobe-tts
[github-codespace-shield]: https://github.com/codespaces/badge.svg
[github-contrib-link]: https://github.com/lobehub/lobe-tts/graphs/contributors
[github-contrib-shield]: https://contrib.rocks/image?repo=lobehub%2Flobe-tts
[github-contributors-link]: https://github.com/lobehub/lobe-tts/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/lobehub/lobe-tts?color=c4f042&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/lobehub/lobe-tts/network/members
[github-forks-shield]: https://img.shields.io/github/forks/lobehub/lobe-tts?color=8ae8ff&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/lobehub/lobe-tts/issues
[github-issues-shield]: https://img.shields.io/github/issues/lobehub/lobe-tts?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/lobehub/lobe-tts/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-tts?color=white&labelColor=black&style=flat-square
[github-releasedate-link]: https://github.com/lobehub/lobe-tts/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/lobehub/lobe-tts?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/lobehub/lobe-tts/network/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/lobehub/lobe-tts?color=ffcb47&labelColor=black&style=flat-square
[llms-txt-link]: https://tts.lobehub.com/llms.txt
[lobe-charts-link]: https://github.com/lobehub/lobe-charts
[lobe-editor-link]: https://github.com/lobehub/lobe-editor
[lobe-icons-link]: https://github.com/lobehub/lobe-icons
[lobe-lint-link]: https://github.com/lobehub/lobe-lint
[lobe-tts-link]: https://github.com/lobehub/lobe-tts
[lobe-ui-link]: https://github.com/lobehub/lobe-ui
[npm-release-link]: https://www.npmjs.com/package/@lobehub/tts
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/tts?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[pr-welcome-link]: https://github.com/lobehub/lobe-tts/pulls
[pr-welcome-shield]: https://img.shields.io/badge/%F0%9F%A4%AF%20PR%20WELCOME-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[profile-link]: https://github.com/lobehub
[skills-md-link]: https://tts.lobehub.com/skills.md
[sponsor-link]: https://opencollective.com/lobehub 'Become 🩷 LobeHub Sponsor'
[sponsor-shield]: https://img.shields.io/badge/-Sponsor%20LobeHub-f04f88?logo=opencollective&logoColor=white&style=flat-square
