import { useState } from 'react';

import { TTSConfig, useTTS } from '@/react/useTTS';
import { type MicrosoftSpeechOptions, fetchMicrosoftSpeech } from '@/services/fetchMicrosoftSpeech';

export const useMicrosoftSpeech = (
  defaultText: string,
  options: MicrosoftSpeechOptions,
  config?: TTSConfig,
) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(
    options.voice,
    text,
    (segmentText: string) => fetchMicrosoftSpeech(segmentText, options),
    config,
  );
  return {
    setText,
    ...rest,
  };
};
