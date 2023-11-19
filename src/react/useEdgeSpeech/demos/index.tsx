import { EdgeSpeechTTS } from '@lobehub/tts';
import { AudioPlayer, useEdgeSpeech } from '@lobehub/tts/react';
import { Icon, StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { Volume2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

import { EDGE_SPEECH_BACKEND_URL } from '../../_util/api';
import { genLevaOptions } from '../../_util/leva';

const defaultText = '这是一段使用 Edge Speech 的语音演示';

export default () => {
  const store = useCreateStore();

  const api: any = useControls(
    {
      serviceUrl: EDGE_SPEECH_BACKEND_URL,
    },
    { store },
  );

  const options: any = useControls(
    {
      voice: {
        options: genLevaOptions(new EdgeSpeechTTS().voiceOptions),
        value: 'zh-CN-YunxiaNeural',
      },
    },
    { store },
  );

  const { setText, isGlobalLoading, start, stop, audio } = useEdgeSpeech(defaultText, {
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
