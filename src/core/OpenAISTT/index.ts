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

export interface OpenAISTTAPI {
  apiKey?: string;
  backendUrl?: string;
  baseUrl?: string;
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
  private OPENAI_BASE_URL: string;
  private OPENAI_API_KEY: string | undefined;
  private BACKEND_URL: string | undefined;

  constructor({ baseUrl, apiKey, backendUrl }: OpenAISTTAPI = {}) {
    this.OPENAI_BASE_URL = baseUrl || OPENAI_BASE_URL;
    this.OPENAI_API_KEY = apiKey;
    this.BACKEND_URL = backendUrl;
  }

  static safeRecordMineType = getRecordMineType;

  fetch = async (payload: OpenAISTTPayload) => {
    const url = urlJoin(this.OPENAI_BASE_URL, 'audio/speech');
    return this.BACKEND_URL
      ? fetch(this.BACKEND_URL, { body: JSON.stringify(payload), method: 'POST' })
      : fetch(url, {
          body: genSTTBody(payload),
          headers: new Headers({
            Authorization: `Bearer ${this.OPENAI_API_KEY}`,
          }),
          method: 'POST',
        });
  };
  create = async (payload: OpenAISTTPayload): Promise<Response> => {
    const response = await this.fetch(payload);

    return response;
  };

  createText = async (payload: OpenAISTTPayload): Promise<string> => {
    const response = await this.fetch(payload);

    const json = await response.json();

    return json.text;
  };
}
