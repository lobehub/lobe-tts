import urlJoin from 'url-join';

import { OPENAI_BASE_URL } from '@/core/const/api';
import { RecordMineType, getRecordMineType } from '@/core/utils/getRecordMineType';

export interface OpenAISTTPayload {
  options: {
    /**
     * @title 语音文件格式
     */
    mineType: RecordMineType;
    /**
     * @title 语音识别的模型名称
     */
    model: string;
  };
  /**
   * @title 语音识别的文件
   */
  speech: Blob;
}

const genSTTBody = ({ speech, options }: OpenAISTTPayload) => {
  const mineType = options?.mineType || getRecordMineType();
  const filename = `${Date.now()}.${mineType.extension}`;
  const file = new File([speech], filename, {
    type: mineType.mineType,
  });

  const body = new FormData();
  body.append('file', file);
  body.append('model', options?.model || 'whisper-1');

  return body;
};

export class OpenaiSTT {
  private BASE_URL: string;
  private OPENAI_API_KEY: string | undefined;

  constructor({ baseUrl, apiKey }: { apiKey?: string; baseUrl?: string } = {}) {
    this.BASE_URL = baseUrl || OPENAI_BASE_URL;
    this.OPENAI_API_KEY = apiKey;
  }

  static safeRecordMineType = getRecordMineType;

  create = async (payload: OpenAISTTPayload): Promise<string> => {
    const url = urlJoin(this.BASE_URL, 'audio/speech');

    const response = await fetch(url, {
      body: genSTTBody(payload),
      headers: new Headers({
        Authorization: `Bearer ${this.OPENAI_API_KEY}`,
      }),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const json = await response.json();

    return json.text;
  };
}
