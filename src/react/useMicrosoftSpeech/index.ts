import { useState } from 'react';

import {
  type MicrosoftSpeechAPI,
  type MicrosoftSpeechPayload,
  MicrosoftSpeechTTS,
} from '@/core/MicrosoftSpeechTTS';
import { type TTSConfig, useTTS } from '@/react/useTTS';

export interface MicrosoftSpeechOptions extends Pick<MicrosoftSpeechPayload, 'options'>, TTSConfig {
  api?: MicrosoftSpeechAPI;
  headers?: Headers;
  locale?: string;
}

export const useMicrosoftSpeech = (defaultText: string, init: MicrosoftSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, locale, api, headers, ...swrConfig } = init;
  const [response, setResponse] = useState<Response>();
  const rest = useTTS(
    options.voice,
    text,
    async (segmentText: string) => {
      const instance = new MicrosoftSpeechTTS({ ...api, locale });
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
