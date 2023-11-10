import { AudioPlayer, AudioVisualizer, useAudioPlayer } from '@lobehub/tts';
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

  const barStyle: any = useControls(
    {
      borderRadius: {
        max: 100,
        min: 0,
        step: 1,
        value: 8,
      },
      count: {
        max: 48,
        min: 0,
        step: 1,
        value: 13,
      },
      gap: {
        max: 24,
        min: 0,
        step: 1,
        value: 4,
      },
      maxHeight: {
        max: 480,
        min: 0,
        step: 1,
        value: 144,
      },
      minHeight: {
        max: 480,
        min: 0,
        step: 1,
        value: 48,
      },
      width: {
        max: 48,
        min: 0,
        step: 1,
        value: 16,
      },
    },
    { store },
  );

  const { ref, isLoading, ...audio } = useAudioPlayer(url);

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={8}>
        <AudioPlayer audio={audio} />
        {!isLoading && audio.duration > 0 && <AudioVisualizer audioRef={ref} barStyle={barStyle} />}
      </Flexbox>
    </StoryBook>
  );
};
