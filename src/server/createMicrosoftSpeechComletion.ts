import { v4 as uuidv4 } from 'uuid';

import { MICROSOFT_SPEECH_URL } from '../const/api';
import { MicrosoftSpeechPayload } from '../server/types';
import { genSSML } from '../utils/genSSML';

interface CreateMicrosoftSpeechComletionOptions {
  payload: MicrosoftSpeechPayload;
}

export const createMicrosoftSpeechComletion = async ({
  payload,
}: CreateMicrosoftSpeechComletionOptions) => {
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

  const res = await fetch(MICROSOFT_SPEECH_URL, {
    body,
    // @ts-ignore
    duplex: 'half',
    headers: DEFAULT_HEADERS,
    method: 'POST',
    // @ts-ignore
    responseType: 'arraybuffer',
  });

  return res;
};
