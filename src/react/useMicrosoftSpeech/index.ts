import { useState } from 'react';

import {
  type MicrosoftSpeechAPI,
  type MicrosoftSpeechPayload,
  MicrosoftSpeechTTS,
} from '@/core/MicrosoftSpeechTTS';
import { type TTSConfig, useTTS } from '@/react/useTTS';

export interface MicrosoftSpeechOptions extends Pick<MicrosoftSpeechPayload, 'options'>, TTSConfig {
  api?: MicrosoftSpeechAPI;
  locale?: string;
}

export const useMicrosoftSpeech = (defaultText: string, config: MicrosoftSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, locale, api, ...swrConfig } = config;
  const rest = useTTS(
    options.voice,
    text,
    (segmentText: string) => {
      const instance = new MicrosoftSpeechTTS({ ...api, locale });
      return instance.create({ input: segmentText, options });
    },
    swrConfig,
  );
  return {
    setText,
    ...rest,
  };
};
