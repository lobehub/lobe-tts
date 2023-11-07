import urlJoin from 'url-join';

export const MICROSOFT_SPEECH_PROXY_URL = process.env.MICROSOFT_SPEECH_PROXY_URL || '';
export const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY || '';
export const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || '';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const OPENAI_PROXY_URL = process.env.OPENAI_PROXY_URL || 'https://api.openai.com/v1';
export const OPENAI_TTS_URL = (api?: string) => urlJoin(api || OPENAI_PROXY_URL, 'audio/speech');
export const OPENAI_STT_URL = (api: string) =>
  urlJoin(api || OPENAI_PROXY_URL, 'audio/transcriptions');
