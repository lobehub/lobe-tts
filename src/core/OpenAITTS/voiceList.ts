import type { SelectProps } from 'antd';

const voiceList = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;
export default voiceList;

export const getOpenaiVoiceOptions = (): SelectProps['options'] => {
  return voiceList.map((voice) => ({ label: voice, value: voice }));
};
