import { OpenAITTS, OpenAITTSPayload } from '@/core';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';

// 实例化 OpenAITTS
const tts = new OpenAITTS({ OPENAI_API_KEY: 'your-api-key' });

// 创建语音合成请求负载
const payload: OpenAITTSPayload = {
  input: '今天是美好的一天',
  options: {
    model: 'tts-1',
    voice: 'alloy',
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
