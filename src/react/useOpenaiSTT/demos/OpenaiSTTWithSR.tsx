import { useOpenaiSTTWithSR } from '@lobehub/tts/react';
import { Icon, StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { Mic, StopCircle } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

import { OPENAI_STT_API_URL } from '../../_util/api';

export default () => {
  const store = useCreateStore();
  const api: any = useControls(
    {
      key: {
        label: 'OPENAI_API_KEY',
        value: '',
      },
      proxy: {
        label: 'OPENAI_PROXY_URL',
        value: '',
      },
      url: OPENAI_STT_API_URL,
    },
    { store },
  );

  const { locale }: any = useControls(
    {
      locale: 'zh-CN',
    },
    { store },
  );

  const { text, start, stop, isLoading, isRecording, url, formattedTime } = useOpenaiSTTWithSR(
    locale,
    { api },
  );
  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={8}>
        {isRecording ? (
          <Button block icon={<Icon icon={StopCircle} />} onClick={stop}>
            Stop {formattedTime}
          </Button>
        ) : isLoading ? (
          <Button block loading>
            Recognition...
          </Button>
        ) : (
          <Button block icon={<Icon icon={Mic} />} onClick={start} type={'primary'}>
            Recognition
          </Button>
        )}
        <Input.TextArea placeholder={'Recognition result...'} value={text} />
        {url && <audio controls src={url} />}
      </Flexbox>
    </StoryBook>
  );
};