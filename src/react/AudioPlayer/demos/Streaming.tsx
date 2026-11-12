import { AudioPlayer, useAudioPlayer } from '@lobehub/tts/react';
import { Flexbox, Text } from '@lobehub/ui';

export default () => {
  const { isLoading, error, ...audio } = useAudioPlayer({
    filename: 'sound.mp3',
    src: 'https://gw.alipayobjects.com/os/kitchen/lnOJK2yZ0K/sound.mp3',
    streaming: true,
  });

  return (
    <Flexbox gap={8} style={{ width: '100%' }}>
      <AudioPlayer audio={{ ...audio, error }} isLoading={isLoading} timeType={'combine'} />
      {error && <Text type={'danger'}>{error.message}</Text>}
    </Flexbox>
  );
};
