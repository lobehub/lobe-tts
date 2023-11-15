import { useState } from 'react';

import { useTTS } from '@/react/useTTS';
import { type MicrosoftSpeechOptions, fetchMicrosoftSpeech } from '@/services/fetchMicrosoftSpeech';

export const useMicrosoftSpeech = (defaultText: string, options: MicrosoftSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(options.voice, text, (segmentText: string) =>
    fetchMicrosoftSpeech(segmentText, options),
  );
  return {
    setText,
    ...rest,
  };
};
