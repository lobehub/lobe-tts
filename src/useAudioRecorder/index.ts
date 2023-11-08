import { useCallback, useMemo, useState } from 'react';

import { secondsToMinutesAndSeconds } from '@/utils/secondsToMinutesAndSeconds';

export const useAudioRecorder = (onBolbAvailable?: (blob: Blob) => void) => {
  const [isRecording, setIsRecording] = useState(false);

  const [time, setTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  // eslint-disable-next-line no-undef
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>();
  const [blob, setBlob] = useState<Blob>();

  const _startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
    setTimerInterval(interval);
  }, []);

  const _stopTimer = useCallback(() => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    timerInterval !== undefined && clearInterval(timerInterval);
    // @ts-ignore
    setTimerInterval();
  }, [timerInterval]);

  const start = useCallback(() => {
    setBlob(undefined);
    if (timerInterval !== undefined) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsRecording(true);
        const recorder: MediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        setMediaRecorder(recorder);
        recorder.start();
        _startTimer();

        recorder.addEventListener('dataavailable', (event) => {
          setBlob(event.data);
          onBolbAvailable?.(event.data);
          recorder.stream.getTracks().forEach((t) => t.stop());
          // @ts-ignore
          setMediaRecorder();
        });
      })
      .catch((error: DOMException) => {
        console.log(error.name, error.message, error.cause);
      });
  }, [timerInterval, _startTimer]);

  const stop = useCallback(() => {
    mediaRecorder?.stop();
    _stopTimer();
    setTime(0);
    setIsRecording(false);
  }, [mediaRecorder, _stopTimer]);

  const url = useMemo(() => blob && URL.createObjectURL(blob), [blob]);

  return {
    blob,
    formattedTime: secondsToMinutesAndSeconds(time),
    isRecording,
    mediaRecorder,
    start,
    stop,
    time,
    url,
  };
};
