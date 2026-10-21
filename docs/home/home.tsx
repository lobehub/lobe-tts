import {
  ClaudeCode,
  Codex,
  Cursor,
  GithubCopilot,
  Microsoft,
  OpenAI,
  Windsurf,
} from '@lobehub/icons';
import { Icon } from '@lobehub/ui';
import {
  AgentSkillCard,
  InstallBanner,
  LandingHero,
  LandingSection,
  LogoMarquee,
} from '@lobehub/ui/awesome';
import { GithubIcon } from '@lobehub/ui/icons';
import { ArrowRight, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { BentoGallery } from './BentoGallery';
import { CodeShowcaseSection } from './CodeShowcase';
import { FeatureSection } from './FeatureSection';
import { renderLink } from './renderLink';

const SITE_URL = 'https://tts.lobehub.com';
const INSTALL_COMMAND = 'pnpm add @lobehub/tts';

const ENGINES = [
  { icon: Microsoft, label: 'Edge Speech' },
  { icon: Microsoft, label: 'Microsoft Speech' },
  { icon: OpenAI, label: 'OpenAI TTS' },
  { icon: OpenAI, label: 'OpenAI Whisper' },
  { icon: <Icon icon={Globe} size={18} />, label: 'Web Speech API' },
];

const AGENTS = [
  { avatar: ClaudeCode.Avatar, title: 'Claude Code' },
  { avatar: Codex.Avatar, title: 'Codex' },
  { avatar: Cursor.Avatar, title: 'Cursor' },
  { avatar: GithubCopilot.Avatar, title: 'GitHub Copilot' },
  { avatar: Windsurf.Avatar, title: 'Windsurf' },
];

export default function Home({
  description,
  getStartedPathname,
}: {
  description: string;
  getStartedPathname: string;
}) {
  const navigate = useNavigate();
  return (
    <>
      <LandingHero
        accent={'TTS & STT'}
        actions={[
          {
            href: getStartedPathname,
            icon: ArrowRight,
            iconPlacement: 'end',
            label: 'Get Started',
            primary: true,
          },
          { href: 'https://github.com/lobehub/lobe-tts', icon: GithubIcon, label: 'GitHub' },
        ]}
        aside={
          <AgentSkillCard
            agent={{
              code: `Read ${SITE_URL}/skills.md and follow it to add speech to my app with @lobehub/tts.`,
              description: 'Send this prompt to your agent to pick the right engine and hook',
            }}
            agents={AGENTS}
            footer={
              <>
                <a href={'/skills.md'} rel={'noreferrer'} target={'_blank'}>
                  skills.md
                </a>
                <a href={'/llms.txt'} rel={'noreferrer'} target={'_blank'}>
                  llms.txt
                </a>
              </>
            }
          />
        }
        badge={
          <a href={'/skills.md'} rel={'noreferrer'} target={'_blank'}>
            AI-native · skills.md and llms.txt for your agent →
          </a>
        }
        description={<span data-pagefind-meta="description">{description}</span>}
        onNavigate={navigate}
        renderLink={renderLink}
        title={<span data-pagefind-meta="title">LobeHub</span>}
      >
        <LogoMarquee
          caption={
            <Link to={'/api-reference'}>Cloud and browser speech engines behind one API</Link>
          }
          items={ENGINES}
        />
      </LandingHero>

      <LandingSection
        actions={[
          {
            href: '/components/use-edge-speech',
            icon: ArrowRight,
            iconPlacement: 'end',
            label: 'Browse hooks',
          },
        ]}
        description={'Every tile below is a live render. Press Speak or Start listening to try it.'}
        eyebrow={'Hooks & components'}
        eyebrowColor={'blue'}
        id={'home-gallery'}
        onNavigate={navigate}
        renderLink={renderLink}
        title={'Give your app a voice'}
      >
        <BentoGallery />
      </LandingSection>

      <LandingSection
        actions={[{ href: '/api-reference', label: 'API reference' }]}
        description={'Switch tabs — each snippet on the left runs live on the right.'}
        eyebrow={'Developer experience'}
        eyebrowColor={'green'}
        id={'home-showcase'}
        onNavigate={navigate}
        renderLink={renderLink}
        title={'A few lines of code, real audio'}
      >
        <CodeShowcaseSection />
      </LandingSection>

      <LandingSection
        actions={[{ href: '/components/audio-player', label: 'Audio components' }]}
        description={'What you get beyond the demo.'}
        eyebrow={'Foundations'}
        eyebrowColor={'orange'}
        id={'home-features'}
        onNavigate={navigate}
        renderLink={renderLink}
        title={'Everything speech needs'}
      >
        <FeatureSection />
      </LandingSection>

      <InstallBanner
        command={INSTALL_COMMAND}
        footnote={
          <>
            Open source · MIT license · <Link to={getStartedPathname}>Get Started →</Link>
          </>
        }
        title={'Start building with Lobe TTS'}
      />
    </>
  );
}
