import { Button, Flexbox, Icon, TextArea } from '@lobehub/ui';
import { Mic, StopCircle } from 'lucide-react';

import { useSpeechRecognition } from '@/react';

export default () => {
  const { text, start, stop, isLoading, formattedTime, url } = useSpeechRecognition('zh-CN');
  return (
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
      <TextArea placeholder={'Recognition result...'} resize value={text} />
      {url && <audio controls src={url} />}
    </Flexbox>
  );
};
