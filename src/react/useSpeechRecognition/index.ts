import {
  SpeechRecognitionRecorderOptions,
  useSpeechRecognitionAutoStop as speechRecognitionAutoStop,
} from './useSpeechRecognitionAutoStop';
import { useSpeechRecognitionInteractive as speechRecognitionInteractive } from './useSpeechRecognitionInteractive';

export interface SpeechRecognitionOptions extends SpeechRecognitionRecorderOptions {
  autoStop?: boolean;
}

export const useSpeechRecognition = (
  locale: string,
  { autoStop, ...rest }: SpeechRecognitionOptions = {},
) => {
  const useSelectedHook = autoStop ? speechRecognitionAutoStop : speechRecognitionInteractive;
  return useSelectedHook(locale, rest);
};
