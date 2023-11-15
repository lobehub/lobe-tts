import { useState } from 'react';

import { TTSConfig, useTTS } from '@/react/useTTS';
import { type OpenaiTtsOptions, fetchOpenaiTTS } from '@/services/fetchOpenaiTTS';

export const useOpenaiTTS = (
  defaultText: string,
  options: OpenaiTtsOptions,
  config?: TTSConfig,
) => {
  const [text, setText] = useState<string>(defaultText);
  const rest = useTTS(
    options.voice,
    text,
    (segmentText: string) => fetchOpenaiTTS(segmentText, options),
    config,
  );
  return {
    setText,
    ...rest,
  };
};
