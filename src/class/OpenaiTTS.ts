import openaiVoiceList from '@/data/openaiVoiceList';
import { fetchOpenaiTTS } from '@/services/fetchOpenaiTTS';
import { getOpenaiVoiceOptions, getVoiceLocaleOptions } from '@/utils/getVoiceList';

export class OpenaiTTS {
  get voiceOptions() {
    return getOpenaiVoiceOptions();
  }
  get localeOptions() {
    return getVoiceLocaleOptions();
  }
  voiceList = openaiVoiceList;
  fetch = fetchOpenaiTTS;
}
