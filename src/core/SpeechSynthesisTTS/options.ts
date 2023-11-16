import { SelectProps } from 'antd';
import { flatten } from 'lodash-es';

import { SpeechSynthesis } from '@/core/const/polyfill';
import voiceLocale from '@/core/data/locales';

import speechSynthesisVoiceList from './voiceList';

const genSpeechSynthesisVoiceList = () => {
  if (!SpeechSynthesis) return speechSynthesisVoiceList;
  const data = SpeechSynthesis?.getVoices();
  if (!data) return speechSynthesisVoiceList;
  const localeKeys = Object.keys(voiceLocale);
  const list: any = {};
  for (const voice of data) {
    if (localeKeys.includes(voice.lang)) {
      if (!list[voice.lang]) list[voice.lang] = [];
      list[voice.lang].push(voice.name);
    }
  }

  return Object.keys(list).length > 0 ? list : speechSynthesisVoiceList;
};

export const getSpeechSynthesisVoiceOptions = (locale?: string): SelectProps['options'] => {
  const voiceList = genSpeechSynthesisVoiceList();
  const data: string[] =
    locale && voiceList?.[locale] ? voiceList?.[locale] || [] : flatten(Object.values(voiceList));

  return data.map((voice) => ({ label: voice, value: voice }));
};
