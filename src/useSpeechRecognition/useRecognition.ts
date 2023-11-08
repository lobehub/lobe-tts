import { useCallback, useEffect, useState } from 'react';

const SpeechRecognition =
  (globalThis as any)?.SpeechRecognition || (window as any)?.webkitSpeechRecognition;

export const useRecognition = (
  locale: string,
  options?: {
    onRecognitionEnd?: () => void;
    onTextChange?: (value: string) => void;
  },
) => {
  const [recognition, setRecognition] = useState<any>(null);
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [finalStop, setFinalStop] = useState<boolean>(false);

  useEffect(() => {
    if (recognition) return;
    try {
      const speechRecognition = new SpeechRecognition();

      speechRecognition.interimResults = true;
      speechRecognition.continuous = true;
      speechRecognition.onstart = () => {
        setFinalStop(false);
        setIsLoading(true);
      };
      speechRecognition.onend = () => {
        setIsLoading(false);
        setFinalStop(true);
      };
      speechRecognition.onresult = ({ results }: any) => {
        if (!results) return;
        const result = results[0];
        if (!finalStop && result?.[0]?.transcript) {
          const value = result[0].transcript;
          setText(value);
          options?.onTextChange?.(value);
        }
        if (result.isFinal) {
          speechRecognition.abort();
          setIsLoading(false);
        }
      };
      setRecognition(speechRecognition);
    } catch (error) {
      console.error(error);
    }
  }, [options]);

  useEffect(() => {
    if (!isLoading) {
      options?.onRecognitionEnd?.();
    }
  }, [isLoading, options]);

  useEffect(() => {
    if (recognition) recognition.lang = locale;
  }, [locale, recognition]);

  const handleStart = useCallback(() => {
    setText('');
    options?.onTextChange?.('');
    try {
      recognition.start();
    } catch {}
  }, [options, recognition]);

  const handleStop = useCallback(() => {
    try {
      recognition.abort();
    } catch {}
    setIsLoading(false);
  }, [recognition]);

  return {
    isLoading,
    start: handleStart,
    stop: handleStop,
    text,
  };
};
