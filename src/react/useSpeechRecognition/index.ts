import {
  SpeechRecognitionRecorderOptions,
  useSpeechRecognitionAutoStop,
} from './useSpeechRecognitionAutoStop';
import { useSpeechRecognitionInteractive } from './useSpeechRecognitionInteractive';

export interface SpeechRecognitionOptions extends SpeechRecognitionRecorderOptions {
  autoStop?: boolean;
}

export const useSpeechRecognition = (
  locale: string,
  { autoStop, ...rest }: SpeechRecognitionOptions = {},
) => {
  const selectedHook = autoStop ? useSpeechRecognitionAutoStop : useSpeechRecognitionInteractive;
  return selectedHook(locale, rest);
};
