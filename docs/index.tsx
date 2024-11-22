import { Grid, Snippet } from '@lobehub/ui';
import { Card } from 'antd';
import { Center, Flexbox } from 'react-layout-kit';

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
        <Card key={'STT'} title={'Speech Recognition'}>
          <STT />
        </Card>
        <Card title={'Text to Speech'}>
          <TTS />
        </Card>
      </Grid>
    </Flexbox>
  );
};
