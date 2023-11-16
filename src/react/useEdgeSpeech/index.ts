import { useState } from 'react';

import { EdgeSpeechPayload, EdgeSpeechTTS } from '@/core/EdgeSpeechTTS';
import { TTSConfig, useTTS } from '@/react/useTTS';

export interface EdgeSpeechOptions extends Pick<EdgeSpeechPayload, 'options'>, TTSConfig {
  api?: {
    url?: string;
  };
}

export const useEdgeSpeech = (defaultText: string, config: EdgeSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const { options, ...swrConfig } = config;
  const rest = useTTS(
    options.voice,
    text,
    (segmentText: string) => {
      const instance = new EdgeSpeechTTS({ baseURL: config.api?.url });

      return instance.create({ input: segmentText, options });
    },
    swrConfig,
  );
  return {
    setText,
    ...rest,
  };
};
