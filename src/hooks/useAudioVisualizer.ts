import { throttle } from 'lodash-es';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

export const useAudioVisualizer = (
  audioRef: RefObject<HTMLAudioElement>,
  {
    count = 5,
  }: {
    count: number;
    humanVoice?: boolean;
  },
) => {
  const barsSet = Array.from({ length: (count + 1) / 2 }).fill(0) as number[];
  const [bars, setBars] = useState<number[]>([0, 0, 0, 0]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const [init, setInit] = useState(false);

  const renderFrame = throttle(() => {
    animationFrameIdRef.current = requestAnimationFrame(renderFrame);
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const step = Math.floor(dataArrayRef.current.length / barsSet.length);
      const newBars = barsSet.map((_, i) => {
        return dataArrayRef.current?.[i * step] || 0;
      });
      setBars(newBars);
    }
  }, 50);

  const resetRenderFrame = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    setBars(barsSet);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    // 初始化AudioContext
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    // 确保AudioContext处于活动状态
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log('Playback resumed successfully');
      });
    }

    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    // 创建音频源
    const audioSource = audioContext.createMediaElementSource(audioRef.current);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    setInit(true);
    return () => {
      audioSource.disconnect();
      analyser.disconnect();

      // 关闭AudioContext
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      setInit(false);
    };
  }, []);

  useEffect(() => {
    if (!init) return;
    resetRenderFrame();
    renderFrame();
    return () => {
      resetRenderFrame();
    };
  }, [init]);

  const reverseBars = [...bars].slice(1, bars.length).reverse();
  return [...reverseBars, ...bars];
};
