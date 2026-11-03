---
title: GiggyTTS
description: 基于 Giggy Speech API 的文本转语音类。
category: API Reference
---

## 介绍

`GiggyTTS` 将 Lobe TTS 的请求格式转换为 Giggy 原生文本转语音请求。默认使用 Fast 模式生成完整 MP3 音频，也可以选择 Batch 模式。Batch 生成有单独的队列和速率限制。

包内负载使用 `input` 和 `options.voice`；发送给 Giggy 的请求使用 `text`、`voice_id`、`mode`、`model_id` 和 `output_format`。`model_id` 为 API 兼容性字段，不会改变推理行为。Fast 和 Batch 返回 MP3。Giggy Streaming 返回 PCM；由于 Lobe TTS 当前解码完整音频响应，本类不提供 Streaming 模式。

## 服务端用法

```ts
import { GiggyTTS } from '@lobehub/tts';
import { Buffer } from 'node:buffer';
import { writeFile } from 'node:fs/promises';

const tts = new GiggyTTS({ apiKey: process.env.GIGGY_API_KEY });
const response = await tts.create({
  input: 'Hello from Lobe TTS',
  options: { mode: 'fast', voice: 'your-giggy-voice-uuid' },
});

if (!response.ok) throw new Error(`Giggy TTS failed: ${response.status}`);
await writeFile('./speech.mp3', Buffer.from(await response.arrayBuffer()));
```

不要在浏览器代码中暴露 `apiKey`。浏览器应用应通过 `serviceUrl` 调用应用服务端，由服务端附加 API key 并转发 Giggy 原生请求。`serviceUrl` 接收包含 `text`、`voice_id`、`mode`、`output_format` 以及所选语速或语言的 JSON。

## 选项

- `apiKey`：Giggy REST API key，仅在服务端代码中使用。
- `serviceUrl`：接收映射后 Giggy 原生请求的服务端点。
- `headers`：附加请求头。
- `options.voice`：Giggy voice UUID。
- `options.mode`：`fast`（默认）或 `batch`。
- `options.speed`：可选语速，范围为 `0.25` 到 `4`。
- `options.languageCode`：可选语言代码，需与所选声音相符。

API key 只会发送到固定的 Giggy API 域名。为避免将凭证转发给代理，`apiKey` 不能与 `serviceUrl` 同时设置；代理应在服务端完成身份验证。React hook 完全不接受 `apiKey`。

## 方法

- `create(payload)`：返回原始 `Response`，供调用方检查响应元数据并处理错误。
- `createAudio(payload)`：返回 `AudioBuffer`；API 响应失败时会携带 HTTP 状态和错误正文抛出异常。
