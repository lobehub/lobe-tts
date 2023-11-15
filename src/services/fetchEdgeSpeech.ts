import { createEdgeSpeechComletion } from '@/server/createEdgeSpeechComletion';
import { EdgeSpeechPayload } from '@/server/types';
import { arrayBufferConvert } from '@/utils/arrayBufferConvert';
import { type SsmlOptions } from '@/utils/genSSML';

export interface EdgeSpeechOptions extends Pick<SsmlOptions, 'voice'> {
  api?: {
    url?: string;
  };
}

export const fetchEdgeSpeech = async (
  input: string,
  { api, ...options }: EdgeSpeechOptions,
): Promise<AudioBuffer> => {
  const payload: EdgeSpeechPayload = { input, options };

  const response = await (api?.url
    ? fetch(api.url, { body: JSON.stringify(payload), method: 'POST' })
    : createEdgeSpeechComletion({ payload }));

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await arrayBufferConvert(arrayBuffer);
  return audioBuffer;
};
