import { Icon } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { Volume2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

import { AudioPlayer, useEdgeSpeech } from '@/react';

export default () => {
  const { setText, isGlobalLoading, start, stop, audio } = useEdgeSpeech('Edge Speech Example', {
    api: {},
    options: {
      voice: 'zh-CN-YunxiaNeural',
    },
  });

  return (
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
      <Input.TextArea
        defaultValue={'Edge Speech Example'}
        onChange={(e) => setText(e.target.value)}
      />
      <AudioPlayer audio={audio} isLoading={isGlobalLoading} onLoadingStop={stop} />
    </Flexbox>
  );
};
