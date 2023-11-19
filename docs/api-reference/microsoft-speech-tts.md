---
group: TTS
title: MicrosoftSpeechTTS
apiHeader:
  pkg: '@lobehub/tts'
---

`MicrosoftSpeechTTS` is a class for text-to-speech using Microsoft Speech Services.

This class supports converting text to speech and provides a series of methods to retrieve speech options and create speech synthesis requests.

```ts
constructor(options: MicrosoftSpeechAPI): MicrosoftSpeechTTS
```

## Parameters

- `options`: Object, optional.
  - `serviceUrl`: String, specifies the URL of Microsoft Speech Services. If provided, requests will be sent to this URL.
  - `locale`: String, specifies the language region to use. If provided, it will be used to filter the available voices.

## Examples

```js
// index.js
// index.js
import { MicrosoftSpeechTTS } from '@lobehub/tts';

// get MicrosoftSpeechTTS instance
const tts = new MicrosoftSpeechTTS({ locale: 'zh-CN' });

// create payload
const payload: MicrosoftSpeechPayload = {
  input: 'this is a message',
  options: {
    voice: 'en-US-JacobNeural',
    style: 'embarrassed',
  },
};

const speechFile = path.resolve('./speech.mp3');

// create speech
const response = await tts.create(payload);
const mp3Buffer = Buffer.from(await response.arrayBuffer());

fs.writeFileSync(speechFile, mp3Buffer);
```

Run with Bun:

```shell
$ bun index.js
```

Run in Node.js:

Due to the lack of `WebSocket` instance in Nodejs environment, we need to polyfill WebSocket. By importing the ws package.

```js
// import at the top of the file
import WebSocket from 'ws';

global.WebSocket = WebSocket;
```

## Static Properties

- `localeOptions`: Get all supported language region options.
- `voiceList`: List of all available voices.
- `voiceName`: Object containing all voice names.
- `styleList`: List of all available voice styles.
- `createRequest`: Static method for creating speech synthesis requests.

## Methods

### `voiceOptions`

Get the voice options for the current instance, based on the `locale` specified during instantiation. Returns an object containing the current available voice options.

### `create(payload: MicrosoftSpeechPayload): Promise<Response>`

Create speech synthesis using the given request payload.

#### Parameters

- `payload`: `MicrosoftSpeechPayload` type, containing the necessary information for the speech synthesis request.

#### Return Value

Returns a `Promise` that resolves to a `Response` object containing the synthesized speech data.

### `createAudio(payload: MicrosoftSpeechPayload): Promise<AudioBuffer>`

Create speech synthesis using the given request payload and convert it to an `AudioBuffer` object.

#### Parameters

- `payload`: `MicrosoftSpeechPayload` type, containing the necessary information for the speech synthesis request.

#### Return Value

Returns a `Promise` that resolves to an `AudioBuffer` object containing the synthesized audio data.
