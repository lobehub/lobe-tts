import { FeatureGrid, type FeatureGridItem } from '@lobehub/ui/awesome';
import { AudioLines, AudioWaveform, Bot, Mic, Server, Zap } from 'lucide-react';

import { renderLink } from './renderLink';

const FEATURES: FeatureGridItem[] = [
  {
    description:
      'Generate audio files in Node.js or Bun, or speak directly in the browser and route requests through your own serviceUrl.',
    href: '/api-reference',
    icon: Server,
    title: 'Server and browser',
  },
  {
    description:
      'Edge Speech, Microsoft Speech and OpenAI TTS classes share the same create(payload) and createAudio(payload) methods.',
    href: '/api-reference',
    icon: AudioLines,
    title: 'One API, many voices',
  },
  {
    description:
      'TTS hooks split long text into segments and start playback as soon as the first one arrives.',
    href: '/components/use-edge-speech',
    icon: Zap,
    title: 'Streaming playback',
  },
  {
    description:
      'Transcribe with OpenAI Whisper or the browser SpeechRecognition API, with an optional auto-stop mode.',
    href: '/components/use-open-aistt',
    icon: Mic,
    title: 'Speech to text',
  },
  {
    description:
      'AudioPlayer and AudioVisualizer cover play, pause, seek, download and live frequency bars.',
    href: '/components/audio-player',
    icon: AudioWaveform,
    title: 'Audio UI included',
  },
  {
    description:
      'skills.md and llms.txt are generated from these docs, so coding agents use the documented API.',
    href: 'https://tts.lobehub.com/skills.md',
    icon: Bot,
    title: 'AI-native docs',
  },
];

export function FeatureSection() {
  return <FeatureGrid items={FEATURES} renderLink={renderLink} />;
}
