import { AudioPlayer, openaiVoiceList, useOpenaiTTS } from '@lobehub/tts';
import { Icon, StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { Volume2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

const defaultText = '这是一段使用 OpenAI Speech to Text 的语音演示';

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
    },
    { store },
  );

  const options: any = useControls(
    {
      name: {
        options: openaiVoiceList,
        value: 'alloy',
      },
    },
    { store },
  );
  const { setText, isGlobalLoading, audio, start, stop } = useOpenaiTTS(defaultText, {
    api,
    ...options,
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
        <AudioPlayer audio={audio} isLoading={isGlobalLoading} />
      </Flexbox>
    </StoryBook>
  );
};
