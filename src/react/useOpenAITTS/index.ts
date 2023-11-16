import { useState } from 'react';

import { OpenAITTS, type OpenAITTSPayload } from '@/core/OpenAITTS';
import { TTSConfig, useTTS } from '@/react/useTTS';

export interface OpenAITTSOptions extends Pick<OpenAITTSPayload, 'options'>, TTSConfig {
  api?: {
    key?: string;
    proxy?: string;
  };
}

export const useOpenAITTS = (defaultText: string, config: OpenAITTSOptions) => {
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
