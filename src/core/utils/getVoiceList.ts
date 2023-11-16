import { SelectProps } from 'antd';

import voiceLocale from '@/core/data/locales';

export const getVoiceLocaleOptions = (): SelectProps['options'] => {
  return Object.entries(voiceLocale).map(([value, label]) => ({ label, value }));
};
