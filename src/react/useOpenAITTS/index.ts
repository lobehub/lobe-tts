import { useState } from 'react';

import { OpenAITTS, type OpenAITTSAPI, type OpenAITTSPayload } from '@/core/OpenAITTS';
import { type TTSConfig, useTTS } from '@/react/useTTS';

export interface OpenAITTSOptions extends Pick<OpenAITTSPayload, 'options'>, TTSConfig {
  api?: OpenAITTSAPI;
}

export const useOpenAITTS = (defaultText: string, config: OpenAITTSOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, ...swrConfig } = config;
  const rest = useTTS(
    options.voice,
    text,
    (segmentText: string) => {
      const instance = new OpenAITTS(api);

      return instance.create({ input: segmentText, options });
    },
    swrConfig,
  );
  return {
    setText,
    ...rest,
  };
};
