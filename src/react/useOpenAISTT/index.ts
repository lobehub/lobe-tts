import { useOpenAISTTAutoStop as openAISTTAutoStop } from './useOpenAISTTAutoStop';
import { useOpenAISTTInteractive as openAISTTInteractive } from './useOpenAISTTInteractive';
import { OpenAISTTRecorderOptions } from './useOpenAISTTRecorder';

export interface OpenAISTTOptions extends OpenAISTTRecorderOptions {
  autoStop?: boolean;
}

export const useOpenAISTT = (locale: string, { autoStop, ...rest }: OpenAISTTOptions = {}) => {
  const useSelectedHook = autoStop ? openAISTTAutoStop : openAISTTInteractive;
  return useSelectedHook(locale, rest);
};
