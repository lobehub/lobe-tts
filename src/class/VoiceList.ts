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

  get azureVoiceOptions() {
    return getAzureVoiceOptions(this.locale);
  }

  get edgeVoiceOptions() {
    return getEdgeVoiceOptions(this.locale);
  }

  get microsoftVoiceOptions() {
    return getEdgeVoiceOptions(this.locale);
  }

  get openaiVoiceOptions() {
    return getOpenaiVoiceOptions();
  }

  get localeOptions() {
    return getVoiceLocaleOptions();
  }
}
