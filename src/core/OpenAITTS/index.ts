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
  headers?: Headers;
  serviceUrl?: string;
}

export class OpenAITTS {
  private OPENAI_BASE_URL: string;
  private OPENAI_API_KEY: string | undefined;
  private serviceUrl: string | undefined;
  private headers?: Headers;

  constructor(api: OpenAITTSAPI = {}) {
    this.OPENAI_BASE_URL = api.OPENAI_PROXY_URL || OPENAI_BASE_URL;
    this.OPENAI_API_KEY = api.OPENAI_API_KEY;
    this.serviceUrl = api.serviceUrl;
    this.headers = api.headers;
  }

  get voiceOptions() {
    return getOpenaiVoiceOptions();
  }

  static voiceList = voiceList;

  fetch = async (payload: OpenAITTSPayload) => {
    const url = urlJoin(this.OPENAI_BASE_URL, 'audio/speech');
    return this.serviceUrl
      ? fetch(this.serviceUrl, {
          body: JSON.stringify(payload),
          headers: this.headers,
          method: 'POST',
        })
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
