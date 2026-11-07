---
title: GiggyTTS
description: 基于 Giggy Speech API 的文本转语音类。
category: API Reference
---

## 介绍

`GiggyTTS` 将 Lobe TTS 的请求格式转换为 Giggy 原生文本转语音请求。此集成始终使用 Giggy Streaming，逐步接收 24 kHz、单声道 PCM16LE 音频。

包内负载使用 `input` 和 `options.voice`；发送给 Giggy 的请求使用 `text`、`voice_id`、`mode`、`model_id` 和 `output_format`。`model_id` 为 API 兼容性字段，不会改变推理行为。此集成固定使用 `mode: streaming` 和 `output_format: pcm_24000`，通过 `Response.body` 返回原始 PCM16LE、单声道、24 kHz 音频流。

## 服务端用法

```ts
import { GiggyTTS } from '@lobehub/tts';
import { Buffer } from 'node:buffer';
import { writeFile } from 'node:fs/promises';

const tts = new GiggyTTS({ apiKey: process.env.GIGGY_API_KEY });
const response = await tts.create({
  input: 'Hello from Lobe TTS',
  options: { voice: 'your-giggy-voice-uuid' },
});

if (!response.ok || !response.body) throw new Error(`Giggy TTS failed: ${response.status}`);
await writeFile('./speech.pcm', new Uint8Array());
for await (const chunk of response.body) {
  await writeFile('./speech.pcm', Buffer.from(chunk), { flag: 'a' });
}
```

不要在浏览器代码中暴露 `apiKey`。浏览器应用应通过 `serviceUrl` 调用应用服务端，由服务端附加 API key 并转发 Giggy 原生请求。`serviceUrl` 接收包含 `text`、`voice_id`、`mode`、`output_format` 以及所选语速或语言的 JSON。

## 选项

- `apiKey`：Giggy REST API key，仅在服务端代码中使用。
- `serviceUrl`：接收映射后 Giggy 原生请求的服务端点。
- `headers`：附加请求头。
- `options.voice`：Giggy voice UUID。
- `options.mode`：仅支持 `streaming`，Fast 和 Batch 会被拒绝。
- `options.speed`：可选语速，范围为 `0.25` 到 `4`。
- `options.languageCode`：可选语言代码，需与所选声音相符。

API key 只会发送到固定的 Giggy API 域名。为避免将凭证转发给代理，`apiKey` 不能与 `serviceUrl` 同时设置；代理应在服务端完成身份验证。React hook 完全不接受 `apiKey`。

## 方法

- `create(payload)`：返回原始 `Response`，供调用方检查响应元数据并处理错误。
- `createAudio(payload)`：原始 PCM Streaming 不支持此方法。请使用 `create(payload)` 并逐步读取 `Response.body`。
