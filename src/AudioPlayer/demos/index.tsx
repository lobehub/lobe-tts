import { AudioPlayer } from '@lobehub/tts';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui';
import { useCallback } from 'react';

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

  const Content = useCallback(
    () => <AudioPlayer audio={new Audio(url)} {...options} />,
    [url, options],
  );

  return (
    <StoryBook levaStore={store}>
      <Content />
    </StoryBook>
  );
};
