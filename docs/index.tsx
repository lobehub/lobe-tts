import { Block, Center, Flexbox, Grid, Snippet } from '@lobehub/ui';

import STT from './STT';
import TTS from './TTS';

export default () => {
  return (
    <Flexbox gap={48} style={{ maxWidth: 960 }} width={'100%'}>
      <Center>
        <h2 style={{ fontSize: 20 }}>To install Lobe TTS, run the following command:</h2>
        <Snippet language={'bash'}>{'$ bun add @lobehub/tts'}</Snippet>
      </Center>
      <Grid rows={2}>
        <Block gap={16} key={'STT'} padding={24} variant={'outlined'}>
          <h3 style={{ fontSize: 16, margin: 0 }}>Speech Recognition</h3>
          <STT />
        </Block>
        <Block gap={16} padding={24} variant={'outlined'}>
          <h3 style={{ fontSize: 16, margin: 0 }}>Text to Speech</h3>
          <TTS />
        </Block>
      </Grid>
    </Flexbox>
  );
};
