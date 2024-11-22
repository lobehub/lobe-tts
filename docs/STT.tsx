import { Icon } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { Mic, StopCircle } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

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
      <Input.TextArea placeholder={'Recognition result...'} value={text} />
      {url && <audio controls src={url} />}
    </Flexbox>
  );
};
