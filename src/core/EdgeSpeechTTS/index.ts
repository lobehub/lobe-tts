import edgeVoiceList from '@/core/EdgeSpeechTTS/edgeVoiceList';
import voiceName from '@/core/data/voiceList';
import { arrayBufferConvert } from '@/core/utils/arrayBufferConvert';
import { SsmlOptions } from '@/core/utils/genSSML';
import { getVoiceLocaleOptions } from '@/core/utils/getVoiceList';

import { createEdgeSpeech } from './createEdgeSpeech';
import { getEdgeVoiceOptions } from './options';

export interface EdgeSpeechPayload {
  /**
   * @title 语音合成的文本
   */
  input: string;
  /**
   * @title SSML 语音合成的配置
   */
  options: Pick<SsmlOptions, 'voice'>;
}

export class EdgeSpeechTTS {
  private locale?: string;
  private BASE_URL: string | undefined;

  constructor({ baseURL, locale }: { baseURL?: string; locale?: string } = {}) {
    this.locale = locale;
    this.BASE_URL = baseURL;
  }

  get voiceOptions() {
    return getEdgeVoiceOptions(this.locale);
  }

  static localeOptions = getVoiceLocaleOptions();
  static voiceList = edgeVoiceList;
  static voiceName = voiceName;
  static createRequest = createEdgeSpeech;

  private fetch = async (payload: EdgeSpeechPayload) => {
    const response = await (this.BASE_URL
      ? fetch(this.BASE_URL, { body: JSON.stringify(payload), method: 'POST' })
      : createEdgeSpeech({ payload }));

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  };

  create = async (payload: EdgeSpeechPayload): Promise<AudioBuffer> => {
    const response = await this.fetch(payload);

    const arrayBuffer = await response.arrayBuffer();

    return arrayBufferConvert(arrayBuffer);
  };
}
