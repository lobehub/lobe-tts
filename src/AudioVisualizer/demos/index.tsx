import { AudioVisualizer, useBlobUrl } from '@lobehub/tts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { useCallback } from 'react';
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
        value: 24,
      },
      count: {
        max: 48,
        min: 0,
        step: 1,
        value: 4,
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
        max: 480,
        min: 0,
        step: 1,
        value: 48,
      },
    },
    { store },
  );

  const { audio, isLoading } = useBlobUrl(url);

  const Content = useCallback(() => {
    if (!audio?.src || isLoading) return 'Loading...';
    audio.play();
    return <AudioVisualizer audio={audio} barStyle={barStyle} />;
  }, [isLoading, audio, barStyle]);

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={8}>
        <Content />
      </Flexbox>
    </StoryBook>
  );
};
