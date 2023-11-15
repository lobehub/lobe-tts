import azureVoiceList from '@/data/azureVoiceList';
import voiceName from '@/data/voiceList';
import { fetchMicrosoftSpeech } from '@/services/fetchMicrosoftSpeech';
import { getAzureVoiceOptions, getVoiceLocaleOptions } from '@/utils/getVoiceList';

export class MicorsoftSpeechTTS {
  private locale?: string;
  constructor(locale?: string) {
    this.locale = locale;
  }
  get voiceOptions() {
    return getAzureVoiceOptions(this.locale);
  }
  get localeOptions() {
    return getVoiceLocaleOptions();
  }
  voiceList = azureVoiceList;
  voiceName = voiceName;
  fetch = fetchMicrosoftSpeech;
}
