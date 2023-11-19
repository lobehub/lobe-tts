import edgeVoiceList from '@/core/EdgeSpeechTTS/edgeVoiceList';
import voiceName from '@/core/data/voiceList';
import { arrayBufferConvert } from '@/core/utils/arrayBufferConvert';
import { getVoiceLocaleOptions } from '@/core/utils/getVoiceList';

import { type EdgeSpeechPayload, createEdgeSpeech } from './createEdgeSpeech';
import { getEdgeVoiceOptions } from './options';

export type { EdgeSpeechPayload } from './createEdgeSpeech';

export interface EdgeSpeechAPI {
  headers?: Headers;
  locale?: string;
  serviceUrl?: string;
}

export class EdgeSpeechTTS {
  private locale?: string;
  private serviceUrl?: string;
  private headers?: Headers;
  constructor({ serviceUrl, locale, headers }: EdgeSpeechAPI = {}) {
    this.locale = locale;
    this.serviceUrl = serviceUrl;
    this.headers = headers;
  }

  get voiceOptions() {
    return getEdgeVoiceOptions(this.locale);
  }

  static localeOptions = getVoiceLocaleOptions();
  static voiceList = edgeVoiceList;
  static voiceName = voiceName;
  static createRequest = createEdgeSpeech;

  private fetch = async (payload: EdgeSpeechPayload) => {
    const response = await (this.serviceUrl
      ? fetch(this.serviceUrl, {
          body: JSON.stringify(payload),
          headers: this.headers,
          method: 'POST',
        })
      : createEdgeSpeech({ payload }));

    return response;
  };

  create = async (payload: EdgeSpeechPayload): Promise<Response> => {
    return this.fetch(payload);
  };

  /**
   * Browser only
   * @param payload
   */
  createAudio = async (payload: EdgeSpeechPayload): Promise<AudioBuffer> => {
    const res = await this.create(payload);

    const arrayBuffer = await res.arrayBuffer();

    return arrayBufferConvert(arrayBuffer);
  };
}
