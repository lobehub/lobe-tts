import { useState } from 'react';

import { AzureSpeechOptions, fetchAzureSpeech } from '@/services/fetchAzureSpeech';
import { useTTS } from '@/useTTS';

export const useAzureSpeech = (defaultText: string, options: AzureSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(options.name, text, (segmentText: string) =>
    fetchAzureSpeech(segmentText, options),
  );
  return {
    setText,
    ...rest,
  };
};
