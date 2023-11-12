import { useState } from 'react';

import { type OpenaiTtsOptions, fetchOpenaiTTS } from '@/services/fetchOpenaiTTS';
import { useTTS } from '@/useTTS';

export const useOpenaiTTS = (defaultText: string, options: OpenaiTtsOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(options.name, text, (segmentText: string) =>
    fetchOpenaiTTS(segmentText, options),
  );
  return {
    setText,
    ...rest,
  };
};
