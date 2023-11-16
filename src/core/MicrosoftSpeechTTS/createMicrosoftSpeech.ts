import { v4 as uuidv4 } from 'uuid';

import { type SsmlOptions, genSSML } from '../utils/genSSML';

const MICROSOFT_SPEECH_URL =
  'https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak';

export interface MicrosoftSpeechPayload {
  /**
   * @title 语音合成的文本
   */
  input: string;
  /**
   * @title SSML 语音合成的配置
   */
  options: SsmlOptions;
}

interface CreateMicrosoftSpeechOptions {
  payload: MicrosoftSpeechPayload;
}

export const createMicrosoftSpeech = async (
  { payload }: CreateMicrosoftSpeechOptions,
  { proxyUrl }: { proxyUrl?: string } = {},
) => {
  const { input, options } = payload;

  const DEFAULT_HEADERS = new Headers({
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'authority': 'southeastasia.api.speech.microsoft.com',
    'content-type': 'application/json',
    'customvoiceconnectionid': uuidv4(),
    'origin': 'https://speech.microsoft.com',
    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
  });

  const body = JSON.stringify({
    offsetInPlainText: 0,
    properties: {
      SpeakTriggerSource: 'AccTuningPagePlayButton',
    },
    ssml: genSSML(input, options),
    ttsAudioFormat: 'audio-24khz-160kbitrate-mono-mp3',
  });

  return fetch(proxyUrl ? proxyUrl : MICROSOFT_SPEECH_URL, {
    body,
    // @ts-ignore
    duplex: 'half',
    headers: DEFAULT_HEADERS,
    method: 'POST',
    responseType: 'arraybuffer',
  });
};
