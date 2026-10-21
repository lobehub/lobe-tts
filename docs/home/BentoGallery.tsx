import { EdgeSpeechTTS, OpenAITTS } from '@lobehub/tts';
import { Flexbox, Highlighter, Select, Snippet, Tag, Text } from '@lobehub/ui';
import { BentoCard, BentoGrid } from '@lobehub/ui/awesome';
import { useMemo, useState } from 'react';

import { EdgeSpeechDemo, SpeechRecognitionDemo } from './demos';
import { renderLink } from './renderLink';

const SERVER_SAMPLE = `import { createOpenaiAudioSpeech } from '@lobehub/tts/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export const POST = async (req: Request) =>
  createOpenaiAudioSpeech({ openai, payload: await req.json() });`;

function EdgeVoicesTile() {
  const [locale, setLocale] = useState('en-US');
  const count = useMemo(() => new EdgeSpeechTTS({ locale }).voiceOptions?.length ?? 0, [locale]);

  return (
    <Flexbox gap={8} width={'100%'}>
      <Select
        onChange={(value) => setLocale(value as string)}
        options={EdgeSpeechTTS.localeOptions}
        showSearch
        style={{ width: '100%' }}
        value={locale}
      />
      <Text type={'secondary'}>{count} voices for this locale</Text>
    </Flexbox>
  );
}

export function BentoGallery() {
  return (
    <BentoGrid>
      <BentoCard
        colSpan={2}
        hint={'text → speech · streaming'}
        href={'/components/use-edge-speech'}
        renderLink={renderLink}
        rowSpan={2}
        title={'useEdgeSpeech + AudioPlayer'}
      >
        <EdgeSpeechDemo />
      </BentoCard>
      <BentoCard
        colSpan={2}
        hint={'speech → text · Web Speech API'}
        href={'/components/use-speech-recognition'}
        renderLink={renderLink}
        title={'useSpeechRecognition'}
      >
        <SpeechRecognitionDemo />
      </BentoCard>
      <BentoCard
        hint={'pick a locale'}
        href={'/api-reference/edge-speech-tts'}
        renderLink={renderLink}
        title={'Edge voices'}
      >
        <EdgeVoicesTile />
      </BentoCard>
      <BentoCard
        hint={'voiceList'}
        href={'/api-reference/openai-tts'}
        renderLink={renderLink}
        title={'OpenAI voices'}
      >
        <Flexbox gap={6} horizontal wrap={'wrap'}>
          {OpenAITTS.voiceList.map((voice) => (
            <Tag key={voice}>{voice}</Tag>
          ))}
        </Flexbox>
      </BentoCard>
      <BentoCard colSpan={2} hint={'ESM only'} title={'Install'}>
        <Snippet language={'bash'}>pnpm add @lobehub/tts</Snippet>
      </BentoCard>
      <BentoCard
        colSpan={2}
        hint={'proxy OpenAI from your API route'}
        title={'@lobehub/tts/server'}
      >
        <Highlighter language={'ts'} style={{ width: '100%' }} variant={'filled'}>
          {SERVER_SAMPLE}
        </Highlighter>
      </BentoCard>
    </BentoGrid>
  );
}
