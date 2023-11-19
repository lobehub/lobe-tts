---
group: TTS
title: EdgeSpeechTTS
apiHeader:
  pkg: '@lobehub/tts'
---

`EdgeSpeechTTS` is a class for text-to-speech conversion based on Edge Speech Service.

This class supports converting text to speech and provides a set of methods to retrieve voice options and create speech synthesis requests.

```ts
constructor(options: EdgeSpeechAPI): EdgeSpeechTTS
```

## Parameters

- `options`: Object, optional.
  - `serviceUrl`: String, specifies the URL of the Edge Speech Service. If provided, requests will be sent to this URL.
  - `locale`: String, specifies the voice locale to use. If provided, it will be used to filter the available voice list.

## Examples

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

Run in Node.js:

As the Node.js environment lacks the `WebSocket` instance, we need to polyfill WebSocket. This can be done by importing the ws package.

```js
// Import at the top of the file
import WebSocket from 'ws';

global.WebSocket = WebSocket;
```

## Static Properties

- `localeOptions`: Get all supported voice locale options.
- `voiceList`: List of all available voices.
- `voiceName`: Object containing all voice names.
- `createRequest`: Static method used to create speech synthesis requests.

## Methods

### `voiceOptions`

Get the voice options for the current instance, based on the `locale` specified during instantiation. Returns an object containing the currently available voice options.

### `createAudio(payload: EdgeSpeechPayload): Promise<AudioBuffer>`

Create speech synthesis using the given request payload.

#### Parameters

- `payload`: `EdgeSpeechPayload` type, containing the necessary information for the speech synthesis request.

#### Return Value

Returns a `Promise` that resolves to an `AudioBuffer` object containing the synthesized audio data.
