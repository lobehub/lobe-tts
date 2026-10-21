import { CodeShowcase, type CodeShowcaseItem } from '@lobehub/ui/awesome';

import { AudioRecorderDemo, EdgeSpeechClassDemo, SpeechSynthesDemo } from './demos';

const EXAMPLES: CodeShowcaseItem[] = [
  {
    code: `import { EdgeSpeechTTS } from '@lobehub/tts'

const tts = new EdgeSpeechTTS({ locale: 'en-US' })

const response = await tts.create({
  input: 'This is a speech demonstration',
  options: { voice: 'en-US-GuyNeural' },
})

const mp3 = await response.arrayBuffer()`,
    key: 'class',
    label: 'EdgeSpeechTTS',
    language: 'ts',
    preview: <EdgeSpeechClassDemo />,
  },
  {
    code: `import { useSpeechSynthes } from '@lobehub/tts/react'

export default () => {
  const { start, stop, isLoading } = useSpeechSynthes(
    'Spoken by your browser, no server needed.',
    { voice: '' },
  )

  return <button onClick={isLoading ? stop : start}>Speak</button>
}`,
    key: 'synthes',
    label: 'useSpeechSynthes',
    preview: <SpeechSynthesDemo />,
  },
  {
    code: `import { useAudioRecorder } from '@lobehub/tts/react'

export default () => {
  const { isRecording, start, stop, url, formattedTime } =
    useAudioRecorder()

  return (
    <>
      <button onClick={isRecording ? stop : start}>
        {isRecording ? \`Stop \${formattedTime}\` : 'Record'}
      </button>
      {url && <audio controls src={url} />}
    </>
  )
}`,
    key: 'recorder',
    label: 'useAudioRecorder',
    preview: <AudioRecorderDemo />,
  },
];

export function CodeShowcaseSection() {
  return <CodeShowcase items={EXAMPLES} />;
}
