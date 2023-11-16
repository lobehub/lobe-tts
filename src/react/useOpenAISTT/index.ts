import { useOpenAISTTAutoStop } from './useOpenAISTTAutoStop';
import { useOpenAISTTInteractive } from './useOpenAISTTInteractive';
import { OpenAISTTRecorderOptions } from './useOpenAISTTRecorder';

export interface OpenAISTTOptions extends OpenAISTTRecorderOptions {
  autoStop?: boolean;
}

export const useOpenAISTT = (locale: string, { autoStop, ...rest }: OpenAISTTOptions = {}) => {
  const selectedHook = autoStop ? useOpenAISTTAutoStop : useOpenAISTTInteractive;
  return selectedHook(locale, rest);
};
