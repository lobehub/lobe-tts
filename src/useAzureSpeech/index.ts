import { useState } from 'react';

import { AzureSpeechOptions, fetchAzureSpeech } from '@/services/fetchAzureSpeech';
import { useTTS } from '@/useTTS';

export const useAzureSpeech = (
  defaultText: string,
  { api, name, style, pitch, rate }: AzureSpeechOptions,
) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(text, (segmentText: string) =>
    fetchAzureSpeech(segmentText, { api, name, pitch, rate, style }),
  );
  return {
    setText,
    ...rest,
  };
};
