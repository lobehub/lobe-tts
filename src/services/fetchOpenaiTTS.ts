import { OPENAI_BASE_URL, OPENAI_TTS_URL } from '@/const/api';
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
  const { key, url = OPENAI_BASE_URL } = api;

  const payload: OpenAITTSPayload = {
    input,
    options: {
      model,
      voice,
    },
  };

  const response = await (api?.url
    ? fetch(api.url, { body: JSON.stringify(payload), method: 'POST' })
    : fetch(OPENAI_TTS_URL(url), {
        body: JSON.stringify({
          input,
          model,
          voice,
        }),
        headers: new Headers({
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        }),
        method: 'POST',
      }));

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const arrayBuffer = await response.arrayBuffer();
  return await arrayBufferConvert(arrayBuffer);
};
