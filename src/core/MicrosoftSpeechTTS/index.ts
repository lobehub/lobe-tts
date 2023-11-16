import voiceName from '@/core/data/voiceList';
import { arrayBufferConvert } from '@/core/utils/arrayBufferConvert';
import { getVoiceLocaleOptions } from '@/core/utils/getVoiceList';

import { MicrosoftSpeechPayload, createMicrosoftSpeech } from './createMicrosoftSpeech';
import azureVoiceList, { getAzureVoiceOptions } from './voiceList';

export type { MicrosoftSpeechPayload } from './createMicrosoftSpeech';

export class MicrosoftSpeechTTS {
  private locale?: string;
  private BASE_URL: string | undefined;

  constructor({ baseURL, locale }: { baseURL?: string; locale?: string } = {}) {
    this.locale = locale;
    this.BASE_URL = baseURL;
  }
  get voiceOptions() {
    return getAzureVoiceOptions(this.locale);
  }

  static localeOptions = getVoiceLocaleOptions();
  static createRequest: typeof createMicrosoftSpeech = createMicrosoftSpeech;

  static voiceList = azureVoiceList;
  static voiceName = voiceName;

  private fetch = async (payload: MicrosoftSpeechPayload) => {
    const response = await (this.BASE_URL
      ? fetch(this.BASE_URL, { body: JSON.stringify(payload), method: 'POST' })
      : createMicrosoftSpeech({ payload }));

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  };

  create = async (payload: MicrosoftSpeechPayload): Promise<AudioBuffer> => {
    const response = await this.fetch(payload);

    const arrayBuffer = await response.arrayBuffer();

    return arrayBufferConvert(arrayBuffer);
  };
}
