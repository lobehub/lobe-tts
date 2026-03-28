import type { SelectProps } from 'antd';

export type MiniMaxVoice =
  | 'English_Graceful_Lady'
  | 'English_Insightful_Speaker'
  | 'English_radiant_girl'
  | 'English_Persuasive_Man'
  | 'English_Lucky_Robot'
  | 'Wise_Woman'
  | 'cute_boy'
  | 'lovely_girl'
  | 'Friendly_Person'
  | 'Inspirational_girl'
  | 'Deep_Voice_Man'
  | 'sweet_girl';

const voiceList: MiniMaxVoice[] = [
  'English_Graceful_Lady',
  'English_Insightful_Speaker',
  'English_radiant_girl',
  'English_Persuasive_Man',
  'English_Lucky_Robot',
  'Wise_Woman',
  'cute_boy',
  'lovely_girl',
  'Friendly_Person',
  'Inspirational_girl',
  'Deep_Voice_Man',
  'sweet_girl',
];

export default voiceList;

export const getMiniMaxVoiceOptions = (): SelectProps['options'] => {
  return voiceList.map((voice) => ({
    label: voice.replaceAll('_', ' '),
    value: voice,
  }));
};
