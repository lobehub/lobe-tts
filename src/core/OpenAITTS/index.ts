import urlJoin from 'url-join';

import { OPENAI_BASE_URL } from '@/core/const/api';
import { arrayBufferConvert } from '@/core/utils/arrayBufferConvert';

import voiceList, { getOpenaiVoiceOptions } from './voiceList';

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

export interface OpenAITTSAPI {
  OPENAI_API_KEY?: string;
  OPENAI_PROXY_URL?: string;
  serviceUrl?: string;
}

export class OpenAITTS {
  private OPENAI_BASE_URL: string;
  private OPENAI_API_KEY: string | undefined;
  private BACKEND_URL: string | undefined;

  constructor({ OPENAI_PROXY_URL, OPENAI_API_KEY, serviceUrl }: OpenAITTSAPI = {}) {
    this.OPENAI_BASE_URL = OPENAI_PROXY_URL || OPENAI_BASE_URL;
    this.OPENAI_API_KEY = OPENAI_API_KEY;
    this.BACKEND_URL = serviceUrl;
  }

  get voiceOptions() {
    return getOpenaiVoiceOptions();
  }

  static voiceList = voiceList;

  fetch = async (payload: OpenAITTSPayload) => {
    const url = urlJoin(this.OPENAI_BASE_URL, 'audio/speech');
    return this.BACKEND_URL
      ? fetch(this.BACKEND_URL, { body: JSON.stringify(payload), method: 'POST' })
      : fetch(url, {
          body: JSON.stringify({
            input: payload.input,
            model: payload.options?.model || 'tts-1',
            voice: payload.options.voice,
          }),
          headers: new Headers({
            'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          }),
          method: 'POST',
        });
  };

  create = async (payload: OpenAITTSPayload): Promise<Response> => {
    const response = await this.fetch(payload);

    return response;
  };

  createAudio = async (payload: OpenAITTSPayload): Promise<AudioBuffer> => {
    const response = await this.create(payload);

    const arrayBuffer = await response.arrayBuffer();
    return await arrayBufferConvert(arrayBuffer);
  };
}
