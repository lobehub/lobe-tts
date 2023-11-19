---
group: TTS
title: MicrosoftSpeechTTS
apiHeader:
  pkg: '@lobehub/tts'
---

`MicrosoftSpeechTTS` 是一个基于 Microsoft 语音服务的文本转语音方法类。

该类支持将文本转换为语音，并提供了一系列方法来获取语音选项，创建语音合成请求。

```ts
constructor(options: MicrosoftSpeechAPI): MicrosoftSpeechTTS
```

## 参数

- `options`: 对象，可选。
  - `serviceUrl`: 字符串，指定 Microsoft 语音服务的 URL。如果提供，将使用此 URL 发送请求。
  - `locale`: 字符串，指定要使用的语音区域设置。如果提供，将用于过滤可用语音列表。

## 示例

```js
// index.js
import { MicrosoftSpeechTTS } from '@lobehub/tts';

// 实例化 MicrosoftSpeechTTS
const tts = new MicrosoftSpeechTTS({ locale: 'zh-CN' });

// 创建语音合成请求负载
const payload: MicrosoftSpeechPayload = {
  input: '这是一段语音演示',
  options: {
    voice: 'yue-CN-XiaoMinNeural',
    style: 'embarrassed',
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

由于 Nodejs 环境缺少 `WebSocket` 实例，所以我们需要 polyfill WebSocket。通过引入 ws 包即可。

```js
// 在文件顶部引入
import WebSocket from 'ws';

global.WebSocket = WebSocket;
```

## 静态属性

- `localeOptions`: 获取所有支持的语音区域选项。
- `voiceList`: 包含所有可用语音的列表。
- `voiceName`: 包含所有语音名称的对象。
- `styleList`: 包含所有可用语音风格的列表。
- `createRequest`: 用于创建语音合成请求的静态方法。

## 方法

### `voiceOptions`

获取当前实例的语音选项，这些选项基于实例化时指定的 `locale`。 返回一个包含当前可用语音选项的对象。

### `create(payload: MicrosoftSpeechPayload): Promise<Response>`

使用给定的请求负载创建语音合成。

#### 参数

- `payload`: `MicrosoftSpeechPayload` 类型，包含语音合成请求的必要信息。

#### 返回值

返回一个 `Promise`，该 `Promise` 解析为 `Response` 对象，包含合成的语音数据。

### `createAudio(payload: MicrosoftSpeechPayload): Promise<AudioBuffer>`

使用给定的请求负载创建语音合成，并将其转换为 `AudioBuffer` 对象。

#### 参数

- `payload`: `MicrosoftSpeechPayload` 类型，包含语音合成请求的必要信息。

#### 返回值

返回一个 `Promise`，该 `Promise` 解析为 `AudioBuffer` 对象，包含合成的音频数据。
