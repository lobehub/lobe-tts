import { useState } from 'react';

import { EdgeSpeechOptions, fetchEdgeSpeech } from '@/services/fetchEdgeSpeech';
import { useTTS } from '@/useTTS';

export const useEdgeSpeech = (defaultText: string, { api, name }: EdgeSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  return useTTS({
    fetchTTS: () => fetchEdgeSpeech(text, { api, name }),
    key: [name, text].join('-'),
    setText,
  });
};
