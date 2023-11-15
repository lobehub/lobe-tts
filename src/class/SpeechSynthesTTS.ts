import speechSynthesVoiceList from '@/data/speechSynthesVoiceList';
import { getSpeechSynthesVoiceOptions, getVoiceLocaleOptions } from '@/utils/getVoiceList';

export class SpeechSynthesTTS {
  private locale?: string;
  constructor(locale?: string) {
    this.locale = locale;
  }

  get voiceOptions() {
    return getSpeechSynthesVoiceOptions(this.locale);
  }

  static localeOptions = getVoiceLocaleOptions();
  static voiceList = speechSynthesVoiceList;
}
