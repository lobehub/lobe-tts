---
group: TTS
title: OpenAITTS
apiHeader:
  pkg: '@lobehub/tts'
---

`OpenAITTS` 是一个基于 OpenAI 语音服务的文本转语音方法类。

该类支持将文本转换为语音，并提供了一系列方法来获取语音选项，创建语音合成请求。

```ts
constructor(options: OpenAITTSAPI): OpenAITTS
```

## 参数

- `options`: 对象，可选。
  - `OPENAI_PROXY_URL`: 字符串，指定 OpenAI 代理 URL。如果提供，将使用此 URL 替换默认的 Base Url。
  - `OPENAI_API_KEY`: 字符串，指定 OpenAI API 密钥。如果提供，将用于身份验证。
  - `serviceUrl`: 字符串，指定要使用的 OpenAI 语音服务的 URL。如果提供，将用于发送请求。

## 示例

```js
// index.js
import { OpenAITTS } from '@lobehub/tts';
import { Buffer } from 'buffer';
import fs from 'fs';
import path from 'path';

// 实例化 OpenAITTS
const tts = new OpenAITTS({ OPENAI_API_KEY: 'your-api-key' });

// 创建语音合成请求负载
const payload = {
  input: 'This is a voice synthesis demo',
  options: {
    model: 'tts-1',
    voice: 'alloy',
  },
};

const speechFile = path.resolve('./speech.mp3');

// 调用 create 方法来合成语音
const response = await tts.create(payload);
const mp3Buffer = Buffer.from(await response.arrayBuffer());

fs.writeFileSync(speechFile, mp3Buffer);
```

使用 Bun 运行：

```shell
$ bun index.js
```

在 Node.js 中运行:

```js
// 在文件顶部引入
import WebSocket from 'ws';

global.WebSocket = WebSocket;
```

## 静态属性

- `voiceList`: 包含所有可用语音的列表。

## 方法

### `voiceOptions`

获取当前实例的语音选项，这些选项基于实例化时指定的 `serviceUrl`。 返回一个包含当前可用语音选项的对象。

### `createAudio(payload: OpenAITTSPayload): Promise<AudioBuffer>`

使用给定的请求负载创建语音合成。

#### 参数

- `payload`: `OpenAITTSPayload` 类型，包含语音合成请求的必要信息。

#### 返回值

返回一个 `Promise`，该 `Promise` 解析为 `AudioBuffer` 对象，包含合成的音频数据。
