import { SelectProps } from 'antd';
import { flatten } from 'lodash-es';

import voiceList from '@/core/data/voiceList';

import edgeVoiceList from './edgeVoiceList';

export const getEdgeVoiceOptions = (locale?: string): SelectProps['options'] => {
  const data =
    locale && (edgeVoiceList as any)[locale]
      ? (edgeVoiceList as any)[locale] || []
      : flatten(Object.values(edgeVoiceList));
  return data.map((voice: any) => ({ label: (voiceList as any)?.[voice] || voice, value: voice }));
};
