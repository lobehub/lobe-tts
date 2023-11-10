export const arrayBufferConvert = async (arrayBuffer: ArrayBuffer): Promise<AudioBuffer> => {
  const audioContext = new AudioContext();
  return await audioContext.decodeAudioData(arrayBuffer);
};
