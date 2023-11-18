import { useState } from 'react';

import {
  type MicrosoftSpeechAPI,
  type MicrosoftSpeechPayload,
  MicrosoftSpeechTTS,
} from '@/core/MicrosoftSpeechTTS';
import { type TTSConfig, useTTS } from '@/react/useTTS';

export interface MicrosoftSpeechOptions extends Pick<MicrosoftSpeechPayload, 'options'>, TTSConfig {
  api?: MicrosoftSpeechAPI;
  locale?: string;
}

export const useMicrosoftSpeech = (defaultText: string, config: MicrosoftSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, locale, api, ...swrConfig } = config;
  const [response, setResponse] = useState<Response>();
  const rest = useTTS(
    options.voice,
    text,
    async (segmentText: string) => {
      const instance = new MicrosoftSpeechTTS({ ...api, locale });
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
