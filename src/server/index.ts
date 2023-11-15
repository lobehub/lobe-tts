export { createEdgeSpeechComletion } from './createEdgeSpeechComletion';
export { createMicrosoftSpeechComletion } from './createMicrosoftSpeechComletion';
export { createOpenaiAudioSpeechCompletion } from './createOpenaiAudioSpeechCompletion';
export { createOpenaiAudioTranscriptionsCompletion } from './createOpenaiAudioTranscriptionsCompletion';
export * from './types';
export {
  EDGE_SPEECH_API_URL,
  MICROSOFT_SPEECH_API_URL,
  OPENAI_STT_API_URL,
  OPENAI_TTS_API_URL,
} from '@/const/api';
export { type EdgeSpeechOptions } from '@/services/fetchEdgeSpeech';
export { type MicrosoftSpeechOptions } from '@/services/fetchMicrosoftSpeech';
export { type OpenaiSttOptions } from '@/services/fetchOpenaiSTT';
export { type OpenaiTtsOptions } from '@/services/fetchOpenaiTTS';
