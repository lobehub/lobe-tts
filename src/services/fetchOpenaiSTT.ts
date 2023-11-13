import { v4 as uuidv4 } from 'uuid';

import { OPENAI_API_KEY, OPENAI_STT_URL } from '@/const/api';
import { RecordMineType, getRecordMineType } from '@/utils/getRecordMineType';

export interface OpenaiSttOptions {
  api?: {
    key?: string;
    proxy?: string;
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
  const url = OPENAI_STT_URL(api?.proxy);

  const headers = new Headers({
    Authorization: `Bearer ${key}`,
  });

  const filename = `${uuidv4()}.${mineType?.extension || getRecordMineType().extension}`;
  const file = new File([speech], filename, {
    type: mineType?.mineType || getRecordMineType().mineType,
  });

  const body = new FormData();
  body.append('file', file);
  body.append('model', model);

  const response: Response = await fetch(url, { body, headers, method: 'POST' });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await response.json();

  return json?.text;
};
