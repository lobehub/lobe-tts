import { useAudioRecorder } from '@lobehub/tts/react';
import { Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { Mic, StopCircle } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const { isRecording, start, stop, url, formattedTime } = useAudioRecorder();
  return (
    <Flexbox gap={8}>
      {isRecording ? (
        <Button block icon={<Icon icon={StopCircle} />} onClick={stop}>
          Stop {formattedTime}
        </Button>
      ) : (
        <Button block icon={<Icon icon={Mic} />} onClick={start} type={'primary'}>
          Record
        </Button>
      )}
      {url && <audio controls src={url} />}
    </Flexbox>
  );
};
