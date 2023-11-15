import urlJoin from 'url-join';

export const MICROSOFT_SPEECH_URL =
  'https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak';
export const EDGE_SPEECH_URL =
  'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1';
export const EDGE_API_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
export const OPENAI_BASE_URL = 'https://api.openai.com/v1';

export const MICROSOFT_SPEECH_API_URL = '/api/microsoft-speech';
export const EDGE_SPEECH_API_URL = '/api/edge-speech';
export const OPENAI_TTS_API_URL = '/api/openai-tts';
export const OPENAI_STT_API_URL = '/api/openai-stt';

export const AZURE_SPEECH_KEY =
  process.env.AZURE_SPEECH_KEY || process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '';
export const AZURE_SPEECH_REGION =
  process.env.AZURE_SPEECH_REGION || process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '';

export const OPENAI_TTS_URL = (api: string) => urlJoin(api, 'audio/speech');
export const OPENAI_STT_URL = (api: string) => urlJoin(api, 'audio/transcriptions');
