import { useState } from 'react';

import { type EdgeSpeechAPI, type EdgeSpeechPayload, EdgeSpeechTTS } from '@/core/EdgeSpeechTTS';
import { type TTSConfig, useTTS } from '@/react/useTTS';

export interface EdgeSpeechOptions extends Pick<EdgeSpeechPayload, 'options'>, TTSConfig {
  api?: EdgeSpeechAPI;
  headers?: Headers;
  locale?: string;
}

export const useEdgeSpeech = (defaultText: string, init: EdgeSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, locale, headers, ...swrConfig } = init;
  const [response, setResponse] = useState<Response>();
  const rest = useTTS(
    options.voice,
    text,
    async (segmentText: string) => {
      const instance = new EdgeSpeechTTS({ ...api, locale });
      const res = await instance.create({ input: segmentText, options }, headers);
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
