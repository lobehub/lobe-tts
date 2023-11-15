import { useState } from 'react';

import { TTSConfig, useTTS } from '@/react/useTTS';
import { EdgeSpeechOptions, fetchEdgeSpeech } from '@/services/fetchEdgeSpeech';

export const useEdgeSpeech = (
  defaultText: string,
  options: EdgeSpeechOptions,
  config?: TTSConfig,
) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(
    options.voice,
    text,
    (segmentText: string) => fetchEdgeSpeech(segmentText, options),
    config,
  );
  return {
    setText,
    ...rest,
  };
};
