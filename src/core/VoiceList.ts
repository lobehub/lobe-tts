import { getEdgeVoiceOptions } from '@/core/EdgeSpeechTTS/options';
import { getAzureVoiceOptions } from '@/core/MicrosoftSpeechTTS/voiceList';
import { getOpenaiVoiceOptions } from '@/core/OpenAITTS/voiceList';
import { getSpeechSynthesisVoiceOptions } from '@/core/SpeechSynthesisTTS/options';
import { getVoiceLocaleOptions } from '@/core/utils/getVoiceList';

export class VoiceList {
  private locale?: string;
  constructor(locale?: string) {
    this.locale = locale;
  }

  get speechSynthesVoiceOptions() {
    return getSpeechSynthesisVoiceOptions(this.locale);
  }

  static allSpeechSynthesVoiceOptions = getSpeechSynthesisVoiceOptions();

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
