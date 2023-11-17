import { useState } from 'react';

import { type EdgeSpeechAPI, type EdgeSpeechPayload, EdgeSpeechTTS } from '@/core/EdgeSpeechTTS';
import { type TTSConfig, useTTS } from '@/react/useTTS';

export interface EdgeSpeechOptions extends Pick<EdgeSpeechPayload, 'options'>, TTSConfig {
  api?: EdgeSpeechAPI;
  locale?: string;
}

export const useEdgeSpeech = (defaultText: string, config: EdgeSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, locale, ...swrConfig } = config;
  const rest = useTTS(
    options.voice,
    text,
    (segmentText: string) => {
      const instance = new EdgeSpeechTTS({ ...api, locale });

      return instance.createAudio({ input: segmentText, options });
    },
    swrConfig,
  );
  return {
    setText,
    ...rest,
  };
};
