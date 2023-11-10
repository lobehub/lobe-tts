import { useState } from 'react';

import { type MicrosoftSpeechOptions, fetchMicrosoftSpeech } from '@/services/fetchMicrosoftSpeech';
import { useTTS } from '@/useTTS';

export const useMicrosoftSpeech = (
  defaultText: string,
  { api, name, pitch, rate, style }: MicrosoftSpeechOptions,
) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(text, (segmentText: string) =>
    fetchMicrosoftSpeech(segmentText, { api, name, pitch, rate, style }),
  );
  return {
    setText,
    ...rest,
  };
};
