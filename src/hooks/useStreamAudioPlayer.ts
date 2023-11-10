import { useCallback, useEffect, useRef, useState } from 'react';

type BufferQueueItem = {
  audioBuffer: AudioBuffer;
  endOffset: number;
  startOffset: number;
};

export interface AudioProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  pause: () => void;
  play: () => void;
  setTime: (time: number) => void;
  stop: () => void;
}
export interface StreamAudioPlayerHook extends AudioProps {
  load: (audioBuffer: AudioBuffer) => void;
  reset: () => void;
}

export const useStreamAudioPlayer = (): StreamAudioPlayerHook => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [bufferQueue, setBufferQueue] = useState<BufferQueueItem[]>([]);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef(0);
  const startOffsetRef = useRef(0);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
  };

  const addAudioBuffer = useCallback(
    (audioBuffer: AudioBuffer) => {
      initAudioContext();
      const context = audioContextRef.current;
      if (context) {
        const newItem: BufferQueueItem = {
          audioBuffer,
          endOffset: duration + audioBuffer.duration,
          startOffset: duration,
        };
        setBufferQueue((prevQueue) => [...prevQueue, newItem]);
        setDuration(newItem.endOffset);
      }
    },
    [duration],
  );

  const playAudio = useCallback(() => {
    if (!audioContextRef.current || isPlaying) return;

    const context = audioContextRef.current;
    const sourceNode = context.createBufferSource();
    sourceNodeRef.current = sourceNode;

    const nextBufferItem = bufferQueue.find((item) => item.startOffset >= currentTime);
    if (nextBufferItem) {
      sourceNode.buffer = nextBufferItem.audioBuffer;
      const playOffset = currentTime - nextBufferItem.startOffset;
      sourceNode.connect(context.destination);
      sourceNode.start(0, playOffset);
      startTimeRef.current = context.currentTime - playOffset;
      startOffsetRef.current = playOffset;

      setIsPlaying(true);

      sourceNode.addEventListener('ended', () => {
        // 检查是否是队列中的最后一段音频
        setIsPlaying(false);
        if (nextBufferItem === bufferQueue.at(-1)) {
          setCurrentTime(0); // 回到开头
        } else {
          setCurrentTime(nextBufferItem.endOffset);
        }
        sourceNodeRef.current = null;
      });
    }
  }, [bufferQueue, currentTime, isPlaying]);

  const pauseAudio = useCallback(() => {
    if (!audioContextRef.current || !isPlaying) return;

    sourceNodeRef.current?.stop();
    setIsPlaying(false);
  }, [isPlaying]);

  const seekAudio = useCallback(
    (time: number) => {
      if (time < 0 || time > duration) return;

      const wasPlaying = isPlaying;
      pauseAudio();
      setCurrentTime(time);

      if (wasPlaying) {
        playAudio();
      }
    },
    [duration, isPlaying, pauseAudio, playAudio],
  );

  // Update currentTime while playing
  useEffect(() => {
    let intervalId: any;

    if (isPlaying) {
      intervalId = setInterval(() => {
        if (!audioContextRef.current) return;
        const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
        setCurrentTime(startOffsetRef.current + elapsed);
      }, 100);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying]);

  // Clean up the audio context on unmount
  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const stopAudio = useCallback(() => {
    pauseAudio();
    seekAudio(0);
  }, [pauseAudio, seekAudio]);

  const resetAudio = useCallback(() => {
    pauseAudio();
    seekAudio(0);
    setBufferQueue([]);
    setDuration(0);
  }, [pauseAudio, seekAudio]);

  return {
    currentTime,
    duration,
    isPlaying,
    load: addAudioBuffer,
    pause: pauseAudio,
    play: playAudio,
    reset: resetAudio,
    setTime: seekAudio,
    stop: stopAudio,
  };
};
