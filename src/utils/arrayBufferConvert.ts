import { audioBufferToBlob } from '@/utils/audioBufferToBlob';

export const arrayBufferConvert = async (arrayBuffer: ArrayBuffer): Promise<Blob> => {
  const audioContext = new AudioContext();
  const buffer = await audioContext.decodeAudioData(arrayBuffer);
  const blob = await audioBufferToBlob(buffer);
  return blob;
};
