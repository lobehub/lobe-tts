import OpenAI from 'openai';

import { OPENAI_API_KEY, OPENAI_PROXY_URL } from '@/const/api';
import { createOpenaiAudioSpeechCompletion } from '@/server/createOpenaiAudioSpeechCompletion';
import { OpenAITTSPayload } from '@/server/types';
import { arrayBufferConvert } from '@/utils/arrayBufferConvert';
import { type SsmlOptions } from '@/utils/genSSML';

export type OpenaiVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface OpenaiTtsOptions extends Pick<SsmlOptions, 'voice'>, OpenAITTSPayload {
  api: {
    key?: string;
    proxy?: string;
    url?: string;
  };
  model?: 'tts-1' | 'tts-1-hd';
  voice: OpenaiVoice;
}
export const fetchOpenaiTTS = async (
  input: string,
  { api = {}, model = 'tts-1', voice }: OpenaiTtsOptions,
): Promise<AudioBuffer> => {
  const key = api?.key || OPENAI_API_KEY;
  const url = api?.proxy || OPENAI_PROXY_URL;

  const payload: OpenAITTSPayload = {
    input,
    options: {
      model,
      voice,
    },
  };

  const response = await (api?.url
    ? fetch(api.url, { body: JSON.stringify(payload), method: 'POST' })
    : await createOpenaiAudioSpeechCompletion({
        openai: new OpenAI({ apiKey: key, baseURL: url }),
        payload,
      }));

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const arrayBuffer = await response.arrayBuffer();
  return await arrayBufferConvert(arrayBuffer);
};
