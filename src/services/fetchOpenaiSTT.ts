import OpenAI from 'openai';

import { OPENAI_API_KEY, OPENAI_PROXY_URL } from '@/const/api';
import { createOpenaiAudioTranscriptionsCompletion } from '@/server/createOpenaiAudioTranscriptionsCompletion';
import { OpenAISTTPayload } from '@/server/types';
import { RecordMineType, getRecordMineType } from '@/utils/getRecordMineType';

export interface OpenaiSttOptions {
  api?: {
    key?: string;
    proxy?: string;
    url?: string;
  };
  mineType?: RecordMineType;
  model?: 'whisper-1';
}

// 纯文本生成语音
export const fetchOpenaiSTT = async (
  speech: Blob,
  { api = {}, model = 'whisper-1', mineType }: OpenaiSttOptions,
): Promise<string> => {
  const key = api?.key || OPENAI_API_KEY;
  const url = api?.proxy || OPENAI_PROXY_URL;

  const payload: OpenAISTTPayload = {
    blob: speech,
    options: {
      mineType: mineType || getRecordMineType(),
      model,
    },
  };

  const response = (await (api?.url
    ? fetch(api.url, { body: JSON.stringify(payload), method: 'POST' })
    : createOpenaiAudioTranscriptionsCompletion({
        openai: new OpenAI({ apiKey: key, baseURL: url }),
        payload,
      }))) as string;

  return response;
};
