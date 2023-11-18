import { useCallback, useEffect, useState } from 'react';

import { useAudioRecorder } from '@/react/useAudioRecorder';
import { type SpeechRecognitionRecorderOptions } from '@/react/useSpeechRecognition/useSpeechRecognitionAutoStop';

import { useSpeechRecognitionCore } from './useSpeechRecognitionCore';

export const useSpeechRecognitionInteractive = (
  locale: string,
  {
    onBlobAvailable,
    onTextChange,
    onRecognitionFinish,
    onStop,
    onStart,
    ...rest
  }: SpeechRecognitionRecorderOptions = {},
) => {
  const [resultText, setResultText] = useState<string>();
  const [texts, setTexts] = useState<string[]>([]);
  const [isGLobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const {
    time,
    formattedTime,
    start: startRecord,
    stop: stopRecord,
    blob,
    url,
  } = useAudioRecorder(onBlobAvailable);
  const { text, stop, start, isLoading } = useSpeechRecognitionCore(locale, {
    onRecognitionFinish: (data) => {
      if (isGLobalLoading && !isLoading) {
        if (data) setTexts([...texts, data]);
        start();
      }
    },
    ...rest,
  });

  const handleStart = useCallback(() => {
    onStart?.();
    setTexts([]);
    setIsGlobalLoading(true);
    start();
    startRecord();
  }, [start, startRecord]);

  const handleStop = useCallback(() => {
    onStop?.();
    stop();
    stopRecord();
    setIsGlobalLoading(false);
    if (resultText) {
      onRecognitionFinish?.(resultText);
    }
  }, [stop, stopRecord, resultText]);

  useEffect(() => {
    const mergedText = [...texts, text].filter(Boolean).join(' ');
    setResultText(mergedText);
    onTextChange?.(mergedText);
  }, [texts, text]);

  return {
    blob,
    formattedTime,
    isLoading: isGLobalLoading,
    isRecording: isGLobalLoading,
    response: new Response(JSON.stringify({ text: resultText }), { status: 200 }),
    start: handleStart,
    stop: handleStop,
    text: resultText,
    time,
    url,
  };
};
