import { OPENAI_API_KEY, OPENAI_PROXY_URL, OPENAI_STT_URL } from '@/const/api';
import { OpenAISTTPayload } from '@/server/types';
import { RecordMineType, getRecordMineType } from '@/utils/getRecordMineType';

const genSTTBody = ({ blob, options }: OpenAISTTPayload) => {
  const filename = `${Date.now()}.${options.mineType.extension}`;
  const file = new File([blob], filename, {
    type: options.mineType.mineType,
  });

  const body = new FormData();
  body.append('file', file);
  body.append('model', options.model);
  return body;
};
export interface OpenaiSttOptions {
  api?: {
    key?: string;
    proxy?: string;
    url?: string;
  };
  mineType?: RecordMineType;
  model?: 'whisper-1';
}
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

  const response = await (api?.url
    ? fetch(api.url, { body: JSON.stringify(payload), method: 'POST' })
    : fetch(OPENAI_STT_URL(url), {
        body: genSTTBody(payload),
        headers: new Headers({
          Authorization: `Bearer ${key}`,
        }),
        method: 'POST',
      }));

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await response.json();

  return json.text;
};
