import { AudioPlayer, useAudioPlayer } from '@lobehub/tts/react';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();

  const { url, ...options }: any = useControls(
    {
      allowPause: false,
      showSlider: true,
      timeRender: {
        options: ['text', 'tag'],
        value: 'text',
      },
      timeType: {
        options: ['left', 'current', 'combine'],
        value: 'left',
      },
      url: 'https://gw.alipayobjects.com/os/kitchen/lnOJK2yZ0K/sound.mp3',
    },
    { store },
  );

  const { isLoading, ...audio } = useAudioPlayer({ src: url });

  return (
    <StoryBook levaStore={store}>
      <AudioPlayer autoplay audio={audio} isLoading={isLoading} {...options} />
    </StoryBook>
  );
};
