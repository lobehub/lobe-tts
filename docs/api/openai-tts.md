---
group: TTS
title: OpenAITTS
apiHeader:
  pkg: '@lobehub/tts'
---

`OpenAITTS` is a class for text-to-speech using the OpenAI voice service.

This class supports converting text into speech and provides a set of methods for getting voice options and creating speech synthesis requests.

```ts
constructor(options: OpenAITTSAPI): OpenAITTS
```

## Parameters

- `options`: Object, optional.
  - `OPENAI_PROXY_URL`: String, specifies the OpenAI proxy URL. If provided, requests will be sent to this URL.
  - `OPENAI_API_KEY`: String, specifies the OpenAI API key. If provided, it will be used for authentication.
  - `serviceUrl`: String, specifies the URL of the OpenAI voice service to use. If provided, it will be used for sending requests.

## Examples

```js
// index.js
import { OpenAITTS } from '@lobehub/tts';
import { Buffer } from 'buffer';
import fs from 'fs';
import path from 'path';

// Instantiate OpenAITTS
const tts = new OpenAITTS({ OPENAI_API_KEY: 'your-api-key' });

// Create speech synthesis request payload
const payload = {
  input: 'This is a voice synthesis demo',
  options: {
    model: 'tts-1',
    voice: 'alloy',
  },
};

const speechFile = path.resolve('./speech.mp3');

// Call create method to synthesize speech
const response = await tts.create(payload);
const mp3Buffer = Buffer.from(await response.arrayBuffer());

fs.writeFileSync(speechFile, mp3Buffer);
```

Run with Bun:

```shell
$ bun index.js
```

In Node.js:

```js
// Import at the top of the file
import WebSocket from 'ws';

global.WebSocket = WebSocket;
```

## Static Properties

- `voiceList`: A list of all available voices.

## Methods

### `voiceOptions`

Get the voice options for the current instance based on the `serviceUrl` specified during instantiation. Returns an object containing the current available voice options.

### `createAudio(payload: OpenAITTSPayload): Promise<AudioBuffer>`

Create speech synthesis using the given request payload.

#### Parameters

- `payload`: `OpenAITTSPayload` type, contains the necessary information for the speech synthesis request.

#### Returns

Returns a `Promise` that resolves to an `AudioBuffer` object containing the synthesized audio data.
