export interface RecordMineType {
  extension: 'webm' | 'mp4';
  mineType: 'audio/webm' | 'audio/mp4';
}

export const getRecordMineType = (): RecordMineType => {
  try {
    return MediaRecorder.isTypeSupported('audio/webm')
      ? {
          extension: 'webm',
          mineType: 'audio/webm',
        }
      : {
          extension: 'mp4',
          mineType: 'audio/mp4',
        };
  } catch {
    return {
      extension: 'webm',
      mineType: 'audio/webm',
    };
  }
};
