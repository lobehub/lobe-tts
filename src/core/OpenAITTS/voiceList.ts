import type { SelectProps } from 'antd';

const voiceList = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer'] as const;
export default voiceList;

export const getOpenaiVoiceOptions = (): SelectProps['options'] => {
  return voiceList.map((voice) => ({ label: voice, value: voice }));
};
