export const playAudioBlob = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const audio = new Audio();
  audio.src = url;
  audio.addEventListener('ended', () => {
    URL.revokeObjectURL(url);
  });
  return {
    audio,
    url,
  };
};
