import { useState } from 'react';

import { AzureSpeechOptions, fetchAzureSpeech } from '@/services/fetchAzureSpeech';
import { useTTS } from '@/useTTS';

export const useAzureSpeech = (
  defaultText: string,
  { api, name, style, pitch, rate }: AzureSpeechOptions,
) => {
  const [text, setText] = useState<string>(defaultText);
  return useTTS({
    fetchTTS: () => fetchAzureSpeech(text, { api, name, pitch, rate, style }),
    key: [name, text].join('-'),
    setText,
  });
};
