import edgeVoiceList from '@/data/edgeVoiceList';
import voiceName from '@/data/voiceList';
import { fetchEdgeSpeech } from '@/services/fetchEdgeSpeech';
import { getEdgeVoiceOptions, getVoiceLocaleOptions } from '@/utils/getVoiceList';

export class EdgeSpeechTTS {
  private locale?: string;
  constructor(locale?: string) {
    this.locale = locale;
  }

  get voiceOptions() {
    return getEdgeVoiceOptions(this.locale);
  }

  static localeOptions = getVoiceLocaleOptions();
  static voiceList = edgeVoiceList;
  static voiceName = voiceName;
  fetch = fetchEdgeSpeech;
}
