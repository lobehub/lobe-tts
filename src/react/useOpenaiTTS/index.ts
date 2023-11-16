import { useState } from 'react';

import { OpenAITTS, type OpenAITTSPayload } from '@/core/OpenAITTS';
import { TTSConfig, useTTS } from '@/react/useTTS';

export interface OpenAITTSConfig extends Pick<OpenAITTSPayload, 'options'>, TTSConfig {
  api?: {
    key?: string;
    proxy?: string;
  };
}

export const useOpenaiTTS = (defaultText: string, config: OpenAITTSConfig) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, ...swrConfig } = config;
  const rest = useTTS(
    options.voice,
    text,
    (segmentText: string) => {
      const instance = new OpenAITTS({ apiKey: api?.key, baseUrl: api?.proxy });

      return instance.create({ input: segmentText, options });
    },
    swrConfig,
  );
  return {
    setText,
    ...rest,
  };
};
