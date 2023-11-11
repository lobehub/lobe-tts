import { useState } from 'react';

import { type OpenaiTtsOptions, fetchOpenaiTTS } from '@/services/fetchOpenaiTTS';
import { useTTS } from '@/useTTS';

export const useOpenaiTTS = (defaultText: string, { api, name }: OpenaiTtsOptions) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(name, text, (segmentText: string) =>
    fetchOpenaiTTS(segmentText, { api, name }),
  );
  return {
    setText,
    ...rest,
  };
};
