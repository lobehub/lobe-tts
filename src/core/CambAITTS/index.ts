import urlJoin from 'url-join';

import { CAMBAI_BASE_URL } from '@/core/const/api';
import { arrayBufferConvert } from '@/core/utils/arrayBufferConvert';

import voiceList, { getCambAIVoiceOptions } from './voiceList';

export type CambAISpeechModel = 'mars-flash' | 'mars-pro' | 'mars-instruct';
export type CambAIOutputFormat = 'mp3' | 'wav' | 'raw';

export interface CambAITTSPayload {
  input: string;
  options: {
    format?: CambAIOutputFormat;
    language: string;
    speech_model?: CambAISpeechModel;
    voice_id: number;
  };
}

export interface CambAITTSAPI {
  CAMBAI_API_KEY?: string;
  CAMBAI_PROXY_URL?: string;
  headers?: Headers;
  serviceUrl?: string;
}

export class CambAITTS {
  private CAMBAI_BASE_URL: string;
  private CAMBAI_API_KEY: string | undefined;
  private serviceUrl: string | undefined;
  private headers?: Headers;

  constructor(api: CambAITTSAPI = {}) {
    this.CAMBAI_BASE_URL = api.CAMBAI_PROXY_URL || CAMBAI_BASE_URL;
    this.CAMBAI_API_KEY = api.CAMBAI_API_KEY;
    this.serviceUrl = api.serviceUrl;
    this.headers = api.headers;
  }

  get voiceOptions() {
    return getCambAIVoiceOptions();
  }

  static voiceList = voiceList;

  fetch = async (payload: CambAITTSPayload) => {
    const url = urlJoin(this.CAMBAI_BASE_URL, 'tts-stream');
    return this.serviceUrl
      ? fetch(this.serviceUrl, {
          body: JSON.stringify(payload),
          headers: this.headers,
          method: 'POST',
        })
      : fetch(url, {
          body: JSON.stringify({
            language: payload.options.language || 'en-us',
            output_configuration: { format: payload.options.format || 'mp3' },
            speech_model: payload.options.speech_model || 'mars-flash',
            text: payload.input,
            voice_id: payload.options.voice_id,
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
            'x-api-key': this.CAMBAI_API_KEY || '',
          }),
          method: 'POST',
        });
  };

  create = async (payload: CambAITTSPayload): Promise<Response> => {
    const response = await this.fetch(payload);

    return response;
  };

  createAudio = async (payload: CambAITTSPayload): Promise<AudioBuffer> => {
    const response = await this.create(payload);

    const arrayBuffer = await response.arrayBuffer();
    return await arrayBufferConvert(arrayBuffer);
  };
}
