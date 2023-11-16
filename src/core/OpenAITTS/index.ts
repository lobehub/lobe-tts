import urlJoin from 'url-join';

import { OPENAI_BASE_URL } from '@/core/const/api';
import { arrayBufferConvert } from '@/core/utils/arrayBufferConvert';
import { getVoiceLocaleOptions } from '@/core/utils/getVoiceList';

import openaiVoiceList, { getOpenaiVoiceOptions } from './voiceList';

export type OpenaiVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface OpenAITTSPayload {
  /**
   * @title 语音合成的文本
   */
  input: string;
  options: {
    /**
     * @title 语音合成的模型名称
     */
    model: string;
    /**
     * @title 语音合成的声音名称
     */
    voice: OpenaiVoice;
  };
}

export class OpenAITTS {
  static voiceList = openaiVoiceList;
  private BASE_URL: string;
  private OPENAI_API_KEY: string | undefined;

  constructor({ baseUrl, apiKey }: { apiKey?: string; baseUrl?: string } = {}) {
    this.BASE_URL = baseUrl || OPENAI_BASE_URL;
    this.OPENAI_API_KEY = apiKey;
  }

  get voiceOptions() {
    return getOpenaiVoiceOptions();
  }

  static localeOptions = getVoiceLocaleOptions();

  create = async ({ input, options }: OpenAITTSPayload): Promise<AudioBuffer> => {
    const url = urlJoin(this.BASE_URL, 'audio/speech');

    const response = await fetch(url, {
      body: JSON.stringify({ input, model: options?.model || 'tts-1', voice: options.voice }),
      headers: new Headers({
        'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const arrayBuffer = await response.arrayBuffer();
    return await arrayBufferConvert(arrayBuffer);
  };
}
