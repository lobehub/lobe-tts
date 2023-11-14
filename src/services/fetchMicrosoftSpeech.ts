import { createMicrosoftSpeechComletion } from '@/server/createMicrosoftSpeechComletion';
import { MicrosoftSpeechPayload } from '@/server/types';
import { arrayBufferConvert } from '@/utils/arrayBufferConvert';
import { type SsmlOptions } from '@/utils/genSSML';

export interface MicrosoftSpeechOptions extends SsmlOptions {
  api?: {
    url?: string;
  };
}

export const fetchMicrosoftSpeech = async (
  input: string,
  { api, ...options }: MicrosoftSpeechOptions,
): Promise<AudioBuffer> => {
  const payload: MicrosoftSpeechPayload = { input, options };

  const response = await (api?.url
    ? fetch(api.url, { body: JSON.stringify(payload), method: 'POST' })
    : createMicrosoftSpeechComletion({ payload }));

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await arrayBufferConvert(arrayBuffer);
  return audioBuffer;
};
