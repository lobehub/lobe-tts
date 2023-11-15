import {
  getAzureVoiceOptions,
  getEdgeVoiceOptions,
  getOpenaiVoiceOptions,
  getSpeechSynthesVoiceOptions,
  getVoiceLocaleOptions,
} from '@/utils/getVoiceList';

export class VoiceList {
  private locale?: string;
  constructor(locale?: string) {
    this.locale = locale;
  }

  get speechSynthesVoiceOptions() {
    return getSpeechSynthesVoiceOptions(this.locale);
  }

  static allSpeechSynthesVoiceOptions = getSpeechSynthesVoiceOptions();

  get azureVoiceOptions() {
    return getAzureVoiceOptions(this.locale);
  }

  static allAzureVoiceOptions = getAzureVoiceOptions();

  get edgeVoiceOptions() {
    return getEdgeVoiceOptions(this.locale);
  }

  static allEdgeVoiceOptions = getEdgeVoiceOptions();

  get microsoftVoiceOptions() {
    return getEdgeVoiceOptions(this.locale);
  }

  static allMicrosoftVoiceOptions = getEdgeVoiceOptions();

  static openaiVoiceOptions = getOpenaiVoiceOptions();

  static localeOptions = getVoiceLocaleOptions();
}
