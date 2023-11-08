import { useState } from 'react';

import { type MicrosoftSpeechOptions, fetchMicrosoftSpeech } from '@/services/fetchMicrosoftSpeech';
import { useTTS } from '@/useTTS';

export const useMicrosoftSpeech = (
  defaultText: string,
  { api, name, pitch, rate, style }: MicrosoftSpeechOptions,
) => {
  const [text, setText] = useState<string>(defaultText);
  return useTTS({
    fetchTTS: () => fetchMicrosoftSpeech(text, { api, name, pitch, rate, style }),
    key: [name, text].join('-'),
    setText,
  });
};
