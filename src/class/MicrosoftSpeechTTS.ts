import azureVoiceList from '@/data/azureVoiceList';
import voiceName from '@/data/voiceList';
import { fetchMicrosoftSpeech } from '@/services/fetchMicrosoftSpeech';
import { getAzureVoiceOptions, getVoiceLocaleOptions } from '@/utils/getVoiceList';

export class MicrosoftSpeechTTS {
  private locale?: string;
  constructor(locale?: string) {
    this.locale = locale;
  }
  get voiceOptions() {
    return getAzureVoiceOptions(this.locale);
  }

  static localeOptions = getVoiceLocaleOptions();

  voiceList = azureVoiceList;
  voiceName = voiceName;
  fetch = fetchMicrosoftSpeech;
}
