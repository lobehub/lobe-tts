import { AudioPlayer, AudioThreeVisualizer, useAudioPlayer } from '@lobehub/tts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const store = useCreateStore();

  const { url }: any = useControls(
    {
      url: 'https://gw.alipayobjects.com/os/kitchen/lnOJK2yZ0K/sound.mp3',
    },
    { store },
  );

  const { ref, isLoading, ...audio } = useAudioPlayer(url);
  return (
    <StoryBook levaStore={store}>
      <Flexbox align={'center'} gap={8}>
        <AudioPlayer audio={audio} isLoading={isLoading} style={{ width: '100%' }} />
        <AudioThreeVisualizer audioRef={ref} height={375} isLoading={isLoading} width={375} />
      </Flexbox>
    </StoryBook>
  );
};
