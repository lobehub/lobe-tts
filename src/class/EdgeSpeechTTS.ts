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
  get localeOptions() {
    return getVoiceLocaleOptions();
  }
  voiceList = edgeVoiceList;
  voiceName = voiceName;
  fetch = fetchEdgeSpeech;
}
