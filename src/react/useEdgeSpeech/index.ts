import { useState } from 'react';

import { type EdgeSpeechAPI, type EdgeSpeechPayload, EdgeSpeechTTS } from '@/core/EdgeSpeechTTS';
import { type TTSOptions, useTTS } from '@/react/useTTS';

export interface EdgeSpeechOptions extends Pick<EdgeSpeechPayload, 'options'>, TTSOptions {
  api?: EdgeSpeechAPI;
  locale?: string;
}

export const useEdgeSpeech = (defaultText: string, init: EdgeSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, locale, ...swrConfig } = init;
  const [response, setResponse] = useState<Response>();
  const rest = useTTS(
    options.voice,
    text,
    async (segmentText: string) => {
      const instance = new EdgeSpeechTTS({ ...api, locale });
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
