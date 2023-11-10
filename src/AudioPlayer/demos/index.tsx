import { AudioPlayer, useAudioPlayer } from '@lobehub/tts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';

export default () => {
  const store = useCreateStore();

  const { url, ...options }: any = useControls(
    {
      allowPause: false,
      showSlider: true,
      showTime: true,
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

  const audio = useAudioPlayer(url);

  return (
    <StoryBook levaStore={store}>
      <AudioPlayer audio={audio} {...options} />
    </StoryBook>
  );
};
