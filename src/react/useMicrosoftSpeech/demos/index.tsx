import { MICROSOFT_SPEECH_API_URL, MicrosoftSpeechTTS } from '@lobehub/tts';
import { AudioPlayer, useMicrosoftSpeech } from '@lobehub/tts/react';
import { Icon, StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { Volume2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

import { genLevaOptions } from '../../_util/leva';

const defaultText = '这是一段使用 Microsoft Speech 的语音演示';

export default () => {
  const store = useCreateStore();
  const api: any = useControls(
    {
      url: {
        label: 'MICROSOFT_SPEECH_API_URL',
        value: MICROSOFT_SPEECH_API_URL,
      },
    },
    { store },
  );
  const options: any = useControls(
    {
      pitch: {
        max: 1,
        min: -1,
        step: 0.1,
        value: 0,
      },
      rate: {
        max: 1,
        min: -1,
        step: 0.1,
        value: 0,
      },
      style: {
        options: [
          'affectionate',
          'angry',
          'calm',
          'cheerful',
          'disgruntled',
          'embarrassed',
          'fearful',
          'general',
          'gentle',
          'sad',
          'serious',
        ],
        value: 'general',
      },
      voice: {
        options: genLevaOptions(new MicrosoftSpeechTTS().voiceOptions),
        value: 'zh-CN-YunxiaNeural',
      },
    },
    { store },
  );
  const { setText, isGlobalLoading, audio, start, stop } = useMicrosoftSpeech(defaultText, {
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
