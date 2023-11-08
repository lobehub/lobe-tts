import urlJoin from 'url-join';

export const MICROSOFT_SPPECH_URL =
  'https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak';
export const MICROSOFT_SPEECH_PROXY_URL =
  process.env.MICROSOFT_SPEECH_PROXY_URL || '/api/microsoft-speech';
export const AZURE_SPEECH_PROXY_URL = process.env.AZURE_SPEECH_PROXY_URL || '/api/azure-speech';
export const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY || '';
export const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || '';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const OPENAI_PROXY_URL = process.env.OPENAI_PROXY_URL || 'https://api.openai.com/v1';
export const OPENAI_TTS_URL = (api?: string) => urlJoin(api || OPENAI_PROXY_URL, 'audio/speech');
export const OPENAI_STT_URL = (api?: string) =>
  urlJoin(api || OPENAI_PROXY_URL, 'audio/transcriptions');
export const EDDGE_PROXY_URL =
  process.env.EDDGE_PROXY_URL ||
  'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1';
export const EDDGE_API_TOKEN = process.env.EDDGE_API_TOKEN || '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
