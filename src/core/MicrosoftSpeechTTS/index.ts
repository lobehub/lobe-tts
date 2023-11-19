import styleList from '@/core/data/styleList';
import voiceName from '@/core/data/voiceList';
import { arrayBufferConvert } from '@/core/utils/arrayBufferConvert';
import { getVoiceLocaleOptions } from '@/core/utils/getVoiceList';

import { type MicrosoftSpeechPayload, createMicrosoftSpeech } from './createMicrosoftSpeech';
import azureVoiceList, { getAzureVoiceOptions } from './voiceList';

export type { MicrosoftSpeechPayload } from './createMicrosoftSpeech';

export interface MicrosoftSpeechAPI {
  headers?: Headers;
  locale?: string;
  serviceUrl?: string;
}

export class MicrosoftSpeechTTS {
  private locale?: string;
  private serviceUrl?: string;
  private headers?: Headers;

  constructor({ serviceUrl, locale, headers }: MicrosoftSpeechAPI = {}) {
    this.locale = locale;
    this.serviceUrl = serviceUrl;
    this.headers = headers;
  }
  get voiceOptions() {
    return getAzureVoiceOptions(this.locale);
  }

  static localeOptions = getVoiceLocaleOptions();
  static createRequest: typeof createMicrosoftSpeech = createMicrosoftSpeech;

  static voiceList = azureVoiceList;
  static voiceName = voiceName;
  static styleList = styleList;

  private fetch = async (payload: MicrosoftSpeechPayload) => {
    const response = await (this.serviceUrl
      ? fetch(this.serviceUrl, {
          body: JSON.stringify(payload),
          headers: this.headers,
          method: 'POST',
        })
      : createMicrosoftSpeech({ payload }));

    return response;
  };

  create = async (payload: MicrosoftSpeechPayload): Promise<Response> => {
    return await this.fetch(payload);
  };

  createAudio = async (payload: MicrosoftSpeechPayload): Promise<AudioBuffer> => {
    const response = await this.create(payload);

    const arrayBuffer = await response.arrayBuffer();

    return arrayBufferConvert(arrayBuffer);
  };
}
