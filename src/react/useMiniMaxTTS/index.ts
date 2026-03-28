import { useState } from 'react';

import { MiniMaxTTS, type MiniMaxTTSAPI, type MiniMaxTTSPayload } from '@/core/MiniMaxTTS';
import { type TTSOptions, useTTS } from '@/react/useTTS';

export interface MiniMaxTTSOptions extends Pick<MiniMaxTTSPayload, 'options'>, TTSOptions {
  api?: MiniMaxTTSAPI;
}

export const useMiniMaxTTS = (defaultText: string, init: MiniMaxTTSOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, ...swrConfig } = init;
  const [response, setResponse] = useState<Response>();
  const rest = useTTS(
    options.voice,
    text,
    async (segmentText: string) => {
      const instance = new MiniMaxTTS(api);
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
