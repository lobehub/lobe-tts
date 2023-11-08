import qs from 'query-string';
import { v4 as uuidv4 } from 'uuid';

import { EDDGE_API_TOKEN, EDDGE_PROXY_URL } from '@/const/api';
import { arrayBufferConvert } from '@/utils/arrayBufferConvert';
import { type SsmlOptions, genSSML } from '@/utils/genSSML';
import { genSendContent } from '@/utils/genSendContent';
import { getHeadersAndData } from '@/utils/getHeadersAndData';

export interface EdgeSpeechOptions extends Pick<SsmlOptions, 'name'> {
  api: {
    key: string;
    proxy: string;
  };
}
export const fetchEdgeSpeech = async (
  text: string,
  { api, ...options }: EdgeSpeechOptions,
): Promise<Blob> => {
  const connectId = uuidv4().replaceAll('-', '');
  const date = new Date().toString();

  const ws = new WebSocket(
    qs.stringifyUrl({
      query: {
        ConnectionId: connectId,
        TrustedClientToken: api.key || EDDGE_API_TOKEN,
      },
      url: api.proxy || EDDGE_PROXY_URL,
    }),
  );
  ws.binaryType = 'arraybuffer';
  ws.addEventListener('open', () => {
    ws.send(
      genSendContent(
        {
          'Content-Type': 'application/json; charset=utf-8',
          'Path': 'speech.config',
          'X-Timestamp': date,
        },
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: { sentenceBoundaryEnabled: false, wordBoundaryEnabled: true },
                outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
              },
            },
          },
        }),
      ),
    );
    ws.send(
      genSendContent(
        {
          'Content-Type': 'application/ssml+xml',
          'Path': 'ssml',
          'X-RequestId': connectId,
          'X-Timestamp': date,
        },
        genSSML(text, options),
      ),
    );
  });

  return new Promise((resolve) => {
    let audioData = new ArrayBuffer(0);
    let downloadAudio = false;

    ws.addEventListener('message', async (event) => {
      if (typeof event.data === 'string') {
        const { headers } = getHeadersAndData(event.data);
        const path = headers['Path'];
        switch (path) {
          case 'turn.start': {
            downloadAudio = true;
            break;
          }
          case 'turn.end': {
            downloadAudio = false;
            if (!audioData.byteLength) return;
            resolve(await arrayBufferConvert(audioData));
            break;
          }
        }
      } else if (event.data instanceof ArrayBuffer) {
        if (!downloadAudio) return;

        const dataview = new DataView(event.data);
        const headerLength = dataview.getInt16(0);
        if (event.data.byteLength > headerLength + 2) {
          const newBody = event.data.slice(2 + headerLength);
          const newAudioData = new ArrayBuffer(audioData.byteLength + newBody.byteLength);
          const mergedUint8Array = new Uint8Array(newAudioData);
          mergedUint8Array.set(new Uint8Array(audioData), 0);
          mergedUint8Array.set(new Uint8Array(newBody), audioData.byteLength);
          audioData = newAudioData;
        }
      }
    });
  });
};
