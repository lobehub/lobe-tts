<div align="center"><a name="readme-top"></a>

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/microphone.webp">

<h1>Lobe TTS</h1>

A high-quality & reliable TTS/STT library for Server and Browser

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

[Changelog](./CHANGELOG.md) · [Report Bug][github-issues-link] · [Request Feature][github-issues-link]

![](https://github-production-user-asset-6210df.s3.amazonaws.com/17870709/284077909-854cc09a-b3c7-4fc4-9ea7-f7137abba351.png)

</div>

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [📖 Introduction](#-introduction)
- [📦 Usage](#-usage)
  - [Generate Speech on server](#generate-speech-on-server)
  - [Use the React Component](#use-the-react-component)
- [📦 Installation](#-installation)
  - [Compile with Next.js](#compile-with-nextjs)
- [⌨️ Local Development](#️-local-development)
- [🤝 Contributing](#-contributing)
- [🩷 Sponsor](#-sponsor)
- [🔗 More Products](#-more-products)

####

</details>

## 📖 Introduction

[🤖 Lobe Chat](https://github.com/lobehub/lobe-chat) supports Text-to-Speech (TTS) and Speech-to-Text (STT) technologies, enabling our application to convert text messages into clear voice outputs,
allowing users to interact with our conversational agent as if they were talking to a real person. Users can choose from a variety of voices to pair with the agent.

In the process of implementing this feature, we found that there was no satisfactory TTS (Text-to-Speech) frontend library available on the market.
As a result, we invested a lot of effort, including data conversion, audio progress management, and speech visualization, among other tasks.

> \[!NOTE]
>
> Therefore, we decided to refine our implementation and make it open source, hoping to assist developers who wish to implement TTS.
> [@lobehub/tts][npm-release-link] is a high-quality TTS toolkit developed in TypeScript, which supports usage both on the server-side and in the browser.
>
> - **Server-side:** With just 15 lines of code, you can achieve high-quality voice generation capabilities comparable to OpenAI's TTS service. It currently supports EdgeSpeechTTS, MicrosoftTTS, OpenAITTS, and OpenAISTT.
> - **Browser-side:** It provides high-quality React Hooks and visual audio components, supporting common functions such as loading, playing, pausing, and dragging the timeline. Additionally, it offers a very rich set of capabilities for adjusting the audio track styles.

## 📦 Usage

### Generate Speech on server

run the script below use Bun: `bun index.js`

```js
// index.js
import { EdgeSpeechTTS } from '@lobehub/tts';
import { Buffer } from 'buffer';
import fs from 'fs';
import path from 'path';

// Instantiate EdgeSpeechTTS
const tts = new EdgeSpeechTTS({ locale: 'en-US' });

// Create speech synthesis request payload
const payload = {
  input: 'This is a speech demonstration',
  options: {
    voice: 'en-US-GuyNeural',
  },
};

// Call create method to synthesize speech
const response = await tts.create(payload);

// generate speech file
const mp3Buffer = Buffer.from(await response.arrayBuffer());
const speechFile = path.resolve('./speech.mp3');

fs.writeFileSync(speechFile, mp3Buffer);
```

<https://github.com/lobehub/lobe-tts/assets/28616219/3ab68c5a-2745-442e-8d66-ca410192ace1>

> \[!IMPORTANT]\
> **Run on Node.js**
>
> As the Node.js environment lacks the `WebSocket` instance, we need to polyfill WebSocket. This can be done by importing the ws package.

```js
// import at the top of the file
import WebSocket from 'ws';

global.WebSocket = WebSocket;
```

### Use the React Component

```tsx
import { AudioPlayer, AudioVisualizer, useAudioPlayer } from '@lobehub/tts/react';

export default () => {
  const { ref, isLoading, ...audio } = useAudioPlayer(url);

  return (
    <Flexbox align={'center'} gap={8}>
      <AudioPlayer audio={audio} isLoading={isLoading} style={{ width: '100%' }} />
      <AudioVisualizer audioRef={ref} isLoading={isLoading} />
    </Flexbox>
  );
};
```

<https://github.com/lobehub/lobe-tts/assets/28616219/c2638383-314f-44c3-b358-8fbbd3028d61>

## 📦 Installation

> \[!IMPORTANT]\
> This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

To install `@lobehub/tts`, run the following command:

```bash
$ pnpm i @lobehub/tts
```

[![][bun-shield]][bun-link]

```bash
$ bun add @lobehub/tts
```

### Compile with Next.js

> \[!NOTE]\
> By work correct with Next.js SSR, add `transpilePackages: ['@lobehub/tts']` to `next.config.js`. For example:

```js
const nextConfig = {
  transpilePackages: ['@lobehub/tts'],
};
```

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
$ bun dev
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

## 🔗 More Products

- **[🤖 Lobe Chat](https://github.com/lobehub/lobe-chat)** - An open-source, extensible (Function Calling), high-performance chatbot framework. It supports one-click free deployment of your private ChatGPT/LLM web application.
- **[🤯 Lobe theme](https://github.com/lobehub/sd-webui-lobe-theme)** - The modern theme for stable diffusion webui, exquisite interface design, highly customizable UI, and efficiency boosting features.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

#### 📝 License

Copyright © 2023 [LobeHub][profile-link]. <br />
This project is [MIT](./LICENSE) licensed.

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-black?style=flat-square
[bun-link]: https://bun.sh
[bun-shield]: https://img.shields.io/badge/-speedup%20with%20bun-black?logo=bun&style=for-the-badge
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
[github-license-link]: https://github.com/lobehub/lobe-tts/blob/main/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-tts?color=white&labelColor=black&style=flat-square
[github-releasedate-link]: https://github.com/lobehub/lobe-tts/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/lobehub/lobe-tts?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/lobehub/lobe-tts/network/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/lobehub/lobe-tts?color=ffcb47&labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/tts
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/tts?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[pr-welcome-link]: https://github.com/lobehub/lobe-tts/pulls
[pr-welcome-shield]: https://img.shields.io/badge/%F0%9F%A4%AF%20PR%20WELCOME-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[profile-link]: https://github.com/lobehub
[sponsor-link]: https://opencollective.com/lobehub 'Become 🩷 LobeHub Sponsor'
[sponsor-shield]: https://img.shields.io/badge/-Sponsor%20LobeHub-f04f88?logo=opencollective&logoColor=white&style=flat-square
