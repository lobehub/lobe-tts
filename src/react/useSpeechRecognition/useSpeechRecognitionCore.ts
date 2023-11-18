import { useCallback, useEffect, useState } from 'react';

import { SpeechRecognition } from '@/core/const/polyfill';

export interface SpeechRecognitionCoreOptions {
  onRecognitionError?: (error: any) => void;
  onRecognitionFinish?: (value: string) => void;
  onRecognitionStart?: () => void;
  onRecognitionStop?: () => void;
  onTextChange?: (value: string) => void;
}

export const useSpeechRecognitionCore = (
  locale: string,
  {
    onTextChange,
    onRecognitionStart,
    onRecognitionFinish,
    onRecognitionStop,
    onRecognitionError,
  }: SpeechRecognitionCoreOptions = {},
) => {
  const [recognition, setRecognition] = useState<any>(null);
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinalStop, setFinalStop] = useState<boolean>(false);

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
        if (!isFinalStop && result?.[0]?.transcript) {
          const value = result[0].transcript;
          setText(value);
          onTextChange?.(value);
        }
        if (result.isFinal) {
          speechRecognition.abort();
        }
      };
      setRecognition(speechRecognition);
    } catch (error) {
      console.error('Error useSpeechRecognitionCore:', error);
      onRecognitionError?.(error);
    }
  }, [isFinalStop]);

  useEffect(() => {
    if (!isLoading && text) {
      onRecognitionFinish?.(text);
    }
  }, [text, isLoading]);

  useEffect(() => {
    if (recognition) recognition.lang = locale;
  }, [recognition, locale]);

  const handleStart = useCallback(() => {
    setText('');
    onTextChange?.('');
    try {
      recognition.start();
      onRecognitionStart?.();
    } catch (error) {
      console.error('Error useSpeechRecognitionCore:', 'start', error);
      onRecognitionError?.(error);
    }
  }, [recognition]);

  const handleStop = useCallback(() => {
    try {
      recognition.abort();
      onRecognitionStop?.();
    } catch (error) {
      console.error('Error useSpeechRecognitionCore:', 'stop', error);
      onRecognitionError?.(error);
    }
    setIsLoading(false);
  }, [recognition]);

  return {
    isLoading: isLoading,
    start: handleStart,
    stop: handleStop,
    text,
  };
};
