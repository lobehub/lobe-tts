export const RECORD_MIME_TYPE = () => {
  return MediaRecorder.isTypeSupported('audio/webm')
    ? {
        extension: 'webm',
        mineType: 'audio/webm',
      }
    : {
        extension: 'mp4',
        mineType: 'audio/mp4',
      };
};
