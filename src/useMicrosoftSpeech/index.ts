import { useState } from 'react';

import { type MicrosoftSpeechOptions, fetchMicrosoftSpeech } from '@/services/fetchMicrosoftSpeech';
import { useTTS } from '@/useTTS';

export const useMicrosoftSpeech = (defaultText: string, options: MicrosoftSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(options.name, text, (segmentText: string) =>
    fetchMicrosoftSpeech(segmentText, options),
  );
  return {
    setText,
    ...rest,
  };
};
