export const playAudioBlob = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  return {
    audio,
    url,
  };
};
