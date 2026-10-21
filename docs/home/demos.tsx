import { EdgeSpeechTTS } from '@lobehub/tts';
import {
  AudioPlayer,
  useAudioRecorder,
  useEdgeSpeech,
  useSpeechRecognition,
  useSpeechSynthes,
} from '@lobehub/tts/react';
import { Button, Flexbox, Icon, TextArea } from '@lobehub/ui';
import { Mic, StopCircle, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const TTS_TEXT =
  'Hello from Lobe TTS. Long text is split into segments and streamed as it arrives.';

export function EdgeSpeechDemo() {
  const { setText, isGlobalLoading, start, stop, audio } = useEdgeSpeech(TTS_TEXT, {
    options: { voice: 'en-US-AriaNeural' },
  });

  return (
    <Flexbox gap={8} width={'100%'}>
      <TextArea defaultValue={TTS_TEXT} onChange={(e) => setText(e.target.value)} rows={3} />
      {isGlobalLoading ? (
        <Button block loading onClick={stop}>
          Generating...
        </Button>
      ) : (
        <Button block icon={<Icon icon={Volume2} />} onClick={start} type={'primary'}>
          Speak
        </Button>
      )}
      <AudioPlayer audio={audio} isLoading={isGlobalLoading} onLoadingStop={stop} />
    </Flexbox>
  );
}

export function SpeechRecognitionDemo() {
  const { text, start, stop, isLoading, formattedTime } = useSpeechRecognition('en-US');

  return (
    <Flexbox gap={8} width={'100%'}>
      {isLoading ? (
        <Button block icon={<Icon icon={StopCircle} />} onClick={stop}>
          Stop {formattedTime}
        </Button>
      ) : (
        <Button block icon={<Icon icon={Mic} />} onClick={start} type={'primary'}>
          Start listening
        </Button>
      )}
      <TextArea placeholder={'Recognized text appears here...'} readOnly rows={2} value={text} />
    </Flexbox>
  );
}

export function SpeechSynthesDemo() {
  const { isLoading, start, stop } = useSpeechSynthes('Spoken by your browser, no server needed.', {
    voice: '',
  });

  return isLoading ? (
    <Button icon={<Icon icon={StopCircle} />} onClick={stop}>
      Stop
    </Button>
  ) : (
    <Button icon={<Icon icon={Volume2} />} onClick={start} type={'primary'}>
      Speak with the browser
    </Button>
  );
}

export function AudioRecorderDemo() {
  const { isRecording, start, stop, url, formattedTime } = useAudioRecorder();

  return (
    <Flexbox align={'center'} gap={12} width={'100%'}>
      {isRecording ? (
        <Button icon={<Icon icon={StopCircle} />} onClick={stop}>
          Stop {formattedTime}
        </Button>
      ) : (
        <Button icon={<Icon icon={Mic} />} onClick={start} type={'primary'}>
          Record
        </Button>
      )}
      {url && <audio controls src={url} style={{ width: '100%' }} />}
    </Flexbox>
  );
}

export function EdgeSpeechClassDemo() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string>();

  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );

  const generate = async () => {
    setLoading(true);
    try {
      const tts = new EdgeSpeechTTS({ locale: 'en-US' });
      const response = await tts.create({
        input: 'This is a speech demonstration',
        options: { voice: 'en-US-GuyNeural' },
      });
      setUrl(URL.createObjectURL(await response.blob()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flexbox align={'center'} gap={12} width={'100%'}>
      <Button icon={<Icon icon={Volume2} />} loading={loading} onClick={generate} type={'primary'}>
        Generate speech.mp3
      </Button>
      {url && <audio autoPlay controls src={url} style={{ width: '100%' }} />}
    </Flexbox>
  );
}
