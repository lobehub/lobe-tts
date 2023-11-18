import { MicrosoftSpeechPayload, MicrosoftSpeechTTS } from '@/core';
import { Buffer } from 'buffer';
import fs from 'fs';
import path from 'path';

// 由于 nodejs 环境缺少 `WebSocket` 实例，因此我们需要将其 polyfill
// import WebSocket from 'ws';
// global.WebSocket = WebSocket;

// 实例化 EdgeSpeechTTS
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
async function main() {
  const response = await tts.create(payload);
  const mp3Buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(speechFile, mp3Buffer);
}

main();
