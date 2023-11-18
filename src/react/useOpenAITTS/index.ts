import { useState } from 'react';

import { OpenAITTS, type OpenAITTSAPI, type OpenAITTSPayload } from '@/core/OpenAITTS';
import { type TTSConfig, useTTS } from '@/react/useTTS';

export interface OpenAITTSOptions extends Pick<OpenAITTSPayload, 'options'>, TTSConfig {
  api?: OpenAITTSAPI;
}

export const useOpenAITTS = (defaultText: string, config: OpenAITTSOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, ...swrConfig } = config;
  const [response, setResponse] = useState<Response>();
  const rest = useTTS(
    options.voice,
    text,
    async (segmentText: string) => {
      const instance = new OpenAITTS(api);
      const res = await instance.create({ input: segmentText, options });
      setResponse(res);
      return res.arrayBuffer();
    },
    swrConfig,
  );
  return {
    response,
    setText,
    ...rest,
  };
};
