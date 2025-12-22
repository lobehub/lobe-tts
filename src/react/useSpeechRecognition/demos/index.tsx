import { useSpeechRecognition } from '@lobehub/tts/react';
import { Flexbox, Icon } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Button, Input } from 'antd';
import { Mic, StopCircle } from 'lucide-react';

export default () => {
  const store = useCreateStore();
  const { locale }: any = useControls(
    {
      locale: 'zh-CN',
    },
    { store },
  );

  const { text, start, stop, isLoading, formattedTime, url } = useSpeechRecognition(locale);
  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={8}>
        {isLoading ? (
          <Button block icon={<Icon icon={StopCircle} />} onClick={stop}>
            Stop {formattedTime}
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
