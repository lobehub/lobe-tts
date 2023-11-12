import { useState } from 'react';

import { EdgeSpeechOptions, fetchEdgeSpeech } from '@/services/fetchEdgeSpeech';
import { useTTS } from '@/useTTS';

export const useEdgeSpeech = (defaultText: string, options: EdgeSpeechOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(options.name, text, (segmentText: string) =>
    fetchEdgeSpeech(segmentText, options),
  );
  return {
    setText,
    ...rest,
  };
};
