import { Snippet } from '@lobehub/ui';
import { Center } from 'react-layout-kit';

export default () => {
  return (
    <Center style={{ marginTop: -88 }}>
      <h2 style={{ fontSize: 20 }}>To install Lobe TTS, run the following command:</h2>
      <Snippet language={'bash'}>{'$ bun add @lobehub/tts'}</Snippet>
    </Center>
  );
};
