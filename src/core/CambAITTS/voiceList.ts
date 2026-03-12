import type { SelectProps } from 'antd';

export interface CambAIVoice {
  id: number;
  language: string;
  name: string;
}

const voiceList: CambAIVoice[] = [
  { id: 147_320, language: 'en-us', name: 'Attic' },
  { id: 147_321, language: 'en-us', name: 'Celeste' },
  { id: 147_322, language: 'en-us', name: 'Elm' },
  { id: 147_323, language: 'en-us', name: 'Fern' },
  { id: 147_324, language: 'en-us', name: 'Haze' },
  { id: 147_325, language: 'en-us', name: 'Ivy' },
  { id: 147_326, language: 'en-us', name: 'Jade' },
  { id: 147_327, language: 'en-us', name: 'Luna' },
  { id: 147_328, language: 'en-us', name: 'Maple' },
  { id: 147_329, language: 'en-us', name: 'Nova' },
  { id: 147_330, language: 'en-us', name: 'Onyx' },
  { id: 147_331, language: 'en-us', name: 'Pearl' },
];
export default voiceList;

export const getCambAIVoiceOptions = (): SelectProps['options'] => {
  return voiceList.map((voice) => ({ label: voice.name, value: voice.id }));
};
