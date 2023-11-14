import { SelectProps } from 'antd';
import { flatten } from 'lodash-es';

import azureVoiceList from '@/data/azureVoiceList';
import edgeVoiceList from '@/data/edgeVoiceList';
import voiceLocale from '@/data/locales';
import openaiVoiceList from '@/data/openaiVoiceList';
import speechSynthesVoiceList from '@/data/speechSynthesVoiceList';
import voiceList from '@/data/voiceList';

export const genSpeechSynthesVoiceList = () => {
  const data = speechSynthesis.getVoices();
  const localeKeys = Object.keys(voiceLocale);
  const list: any = {};
  for (const voice of data) {
    if (localeKeys.includes(voice.lang)) {
      if (!list[voice.lang]) list[voice.lang] = [];
      list[voice.lang].push(voice.name);
    }
  }

  return Object.keys(list).length > 0 ? list : speechSynthesVoiceList;
};

export const getSpeechSynthesVoiceOptions = (locale?: string): SelectProps['options'] => {
  const speechSynthesVoiceList = genSpeechSynthesVoiceList();
  const data: string[] =
    locale && speechSynthesVoiceList?.[locale]
      ? speechSynthesVoiceList?.[locale] || []
      : flatten(Object.values(speechSynthesVoiceList));

  return data.map((voice) => ({ label: voice, value: voice }));
};

export const getAzureVoiceOptions = (locale?: string): SelectProps['options'] => {
  const data =
    locale && (azureVoiceList as any)?.[locale]
      ? (azureVoiceList as any)?.[locale] || []
      : flatten(Object.values(azureVoiceList));

  return data.map((voice: any) => ({ label: (voiceList as any)?.[voice] || voice, value: voice }));
};

export const getEdgeVoiceOptions = (locale?: string): SelectProps['options'] => {
  const data =
    locale && (edgeVoiceList as any)[locale]
      ? (edgeVoiceList as any)[locale] || []
      : flatten(Object.values(edgeVoiceList));
  return data.map((voice: any) => ({ label: (voiceList as any)?.[voice] || voice, value: voice }));
};

export const getOpenaiVoiceOptions = (): SelectProps['options'] => {
  return openaiVoiceList.map((voice) => ({ label: voice, value: voice }));
};

export const getVoiceLocaleOptions = (): SelectProps['options'] => {
  return Object.entries(voiceLocale).map(([value, label]) => ({ label, value }));
};

export const genLevaOptions = (options: SelectProps['options']) => {
  const data: any = {};
  options?.forEach((item: any) => (data[item?.label || item?.value] = item?.value));
  return data;
};
