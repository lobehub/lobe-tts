import { useState } from 'react';

import { CambAITTS, type CambAITTSAPI, type CambAITTSPayload } from '@/core/CambAITTS';
import { type TTSOptions, useTTS } from '@/react/useTTS';

export interface CambAITTSOptions extends Pick<CambAITTSPayload, 'options'>, TTSOptions {
  api?: CambAITTSAPI;
}

export const useCambAITTS = (defaultText: string, init: CambAITTSOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, ...swrConfig } = init;
  const [response, setResponse] = useState<Response>();
  const rest = useTTS(
    String(options.voice_id),
    text,
    async (segmentText: string) => {
      const instance = new CambAITTS(api);
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
