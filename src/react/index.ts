export { default as AudioPlayer, type AudioPlayerProps } from './AudioPlayer';
export { default as AudioVisualizer, type AudioVisualizerProps } from './AudioVisualizer';
export { type AudioPlayerHook, useAudioPlayer } from './hooks/useAudioPlayer';
export { useAudioVisualizer } from './hooks/useAudioVisualizer';
export { useBlobUrl } from './hooks/useBlobUrl';
export { useStreamAudioPlayer } from './hooks/useStreamAudioPlayer';
export { useAudioRecorder } from './useAudioRecorder';
export { useEdgeSpeech } from './useEdgeSpeech';
export { useMicrosoftSpeech } from './useMicrosoftSpeech';
export {
  type OpenaiSpeechRecognitionOptions,
  useOpenaiSTT,
  useOpenaiSTTWithPSR,
  useOpenaiSTTWithRecord,
  useOpenaiSTTWithSR,
} from './useOpenaiSTT';
export { useOpenaiTTS } from './useOpenaiTTS';
export { usePersistedSpeechRecognition } from './useSpeechRecognition/usePersistedSpeechRecognition';
export {
  type SpeechRecognitionOptions,
  useSpeechRecognition,
} from './useSpeechRecognition/useSpeechRecognition';
export { useSpeechSynthes } from './useSpeechSynthes';
export { type EdgeSpeechOptions } from '@/services/fetchEdgeSpeech';
export { type MicrosoftSpeechOptions } from '@/services/fetchMicrosoftSpeech';
export { type OpenaiSttOptions } from '@/services/fetchOpenaiSTT';
export { type OpenaiTtsOptions } from '@/services/fetchOpenaiTTS';
