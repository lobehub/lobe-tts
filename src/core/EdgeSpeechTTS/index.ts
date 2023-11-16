import edgeVoiceList from '@/core/EdgeSpeechTTS/edgeVoiceList';
import voiceName from '@/core/data/voiceList';
import { arrayBufferConvert } from '@/core/utils/arrayBufferConvert';
import { getVoiceLocaleOptions } from '@/core/utils/getVoiceList';

import { type EdgeSpeechPayload, createEdgeSpeech } from './createEdgeSpeech';
import { getEdgeVoiceOptions } from './options';

export type { EdgeSpeechPayload } from './createEdgeSpeech';

export interface EdgeSpeechAPI {
  backendUrl?: string;
}

export class EdgeSpeechTTS {
  private locale?: string;
  private BACKEND_URL: string | undefined;

  constructor({ backendUrl, locale }: EdgeSpeechAPI & { locale?: string } = {}) {
    this.locale = locale;
    this.BACKEND_URL = backendUrl;
  }

  get voiceOptions() {
    return getEdgeVoiceOptions(this.locale);
  }

  static localeOptions = getVoiceLocaleOptions();
  static voiceList = edgeVoiceList;
  static voiceName = voiceName;
  static createRequest = createEdgeSpeech;

  private fetch = async (payload: EdgeSpeechPayload) => {
    const response = await (this.BACKEND_URL
      ? fetch(this.BACKEND_URL, { body: JSON.stringify(payload), method: 'POST' })
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
