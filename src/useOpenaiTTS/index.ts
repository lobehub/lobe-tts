import { useState } from 'react';

import { type OpenaiTtsOptions, fetchOpenaiTTS } from '@/services/fetchOpenaiTTS';
import { useTTS } from '@/useTTS';

export const useOpenaiTTS = (defaultText: string, { api, name }: OpenaiTtsOptions) => {
  const [text, setText] = useState<string>(defaultText);
  return useTTS({
    fetchTTS: () => fetchOpenaiTTS(text, { api, name }),
    key: [name, text].join('-'),
    setText,
  });
};
