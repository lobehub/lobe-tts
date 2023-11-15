import openaiVoiceList from '@/data/openaiVoiceList';
import { fetchOpenaiTTS } from '@/services/fetchOpenaiTTS';
import { getOpenaiVoiceOptions, getVoiceLocaleOptions } from '@/utils/getVoiceList';

export class OpenaiTTS {
  static voiceList = openaiVoiceList;

  get voiceOptions() {
    return getOpenaiVoiceOptions();
  }
  get localeOptions() {
    return getVoiceLocaleOptions();
  }

  static localeOptions = getVoiceLocaleOptions();

  fetch = fetchOpenaiTTS;
}
