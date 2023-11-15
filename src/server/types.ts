import { SsmlOptions } from '@/utils/genSSML';
import { RecordMineType } from '@/utils/getRecordMineType';

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

export interface EdgeSpeechPayload {
  /**
   * @title 语音合成的文本
   */
  input: string;
  /**
   * @title SSML 语音合成的配置
   */
  options: Pick<SsmlOptions, 'voice'>;
}

export interface OpenAITTSPayload {
  /**
   * @title 语音合成的文本
   */
  input: string;
  options: {
    /**
     * @title 语音合成的模型名称
     */
    model: string;
    /**
     * @title 语音合成的声音名称
     */
    voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  };
}

export interface OpenAISTTPayload {
  /**
   * @title 语音识别的文件
   */
  blob: Blob;
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
}
