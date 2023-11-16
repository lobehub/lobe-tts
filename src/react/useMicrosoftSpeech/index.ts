import { useState } from 'react';

import { type MicrosoftSpeechPayload, MicrosoftSpeechTTS } from '@/core/MicrosoftSpeechTTS';
import { TTSConfig, useTTS } from '@/react/useTTS';

interface MicrosoftSpeechOptions extends Pick<MicrosoftSpeechPayload, 'options'>, TTSConfig {
  api?: {
    url?: string;
  };
  locale?: string;
}

export const useMicrosoftSpeech = (defaultText: string, config: MicrosoftSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, locale, api, ...swrConfig } = config;
  const rest = useTTS(
    options.voice,
    text,
    (segmentText: string) => {
      const instance = new MicrosoftSpeechTTS({ baseURL: api?.url, locale });
      return instance.create({ input: segmentText, options });
    },
    swrConfig,
  );
  return {
    setText,
    ...rest,
  };
};
