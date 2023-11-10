import { useState } from 'react';

import { EdgeSpeechOptions, fetchEdgeSpeech } from '@/services/fetchEdgeSpeech';
import { useTTS } from '@/useTTS';

export const useEdgeSpeech = (defaultText: string, { api, name }: EdgeSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(text, (segmentText: string) => fetchEdgeSpeech(segmentText, { api, name }));
  return {
    setText,
    ...rest,
  };
};
