import { SelectProps } from 'antd';
import { flatten } from 'lodash-es';

import voiceLocale from '@/core/data/locales';

import speechSynthesisVoiceList from './voiceList';

const genSpeechSynthesisVoiceList = () => {
  const data = speechSynthesis.getVoices();
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
  const speechSynthesVoiceList = genSpeechSynthesisVoiceList();
  const data: string[] =
    locale && speechSynthesVoiceList?.[locale]
      ? speechSynthesVoiceList?.[locale] || []
      : flatten(Object.values(speechSynthesVoiceList));

  return data.map((voice) => ({ label: voice, value: voice }));
};
