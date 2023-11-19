import { OpenAITTS } from '@lobehub/tts';
import { AudioPlayer, useOpenAITTS } from '@lobehub/tts/react';
import { Icon, StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { Volume2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

import { OPENAI_BASE_URL } from '@/core/const/api';

const defaultText = '这是一段使用 OpenAI Speech to Text 的语音演示';

export default () => {
  const store = useCreateStore();

  const api: any = useControls(
    {
      OPENAI_API_KEY: {
        label: 'OPENAI_API_KEY',
        value: '',
      },
      OPENAI_PROXY_URL: {
        label: 'OPENAI_PROXY_URL',
        value: OPENAI_BASE_URL,
      },
      serviceUrl: '',
    },
    { store },
  );

  const options: any = useControls(
    {
      voice: {
        options: OpenAITTS.voiceList,
        value: 'alloy',
      },
    },
    { store },
  );
  const { setText, isGlobalLoading, audio, start, stop } = useOpenAITTS(defaultText, {
    api,
    options,
  });
  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={8}>
        {isGlobalLoading ? (
          <Button block loading onClick={stop}>
            Generating...
          </Button>
        ) : (
          <Button block icon={<Icon icon={Volume2} />} onClick={start} type={'primary'}>
            Speak
          </Button>
        )}
        <Input.TextArea defaultValue={defaultText} onChange={(e) => setText(e.target.value)} />
        <AudioPlayer audio={audio} isLoading={isGlobalLoading} onLoadingStop={stop} />
      </Flexbox>
    </StoryBook>
  );
};
