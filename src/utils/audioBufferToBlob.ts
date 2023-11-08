export const audioBufferToBlob = async (audioBuffer: AudioBuffer): Promise<Blob> => {
  const audioBufferToWav = (buffer: AudioBuffer) => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferOut = new ArrayBuffer(length);
    const view = new DataView(bufferOut);
    const channels = [];
    let sample;
    let offset = 0;
    let pos = 0;

    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };

    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // 写入 WAV 头部信息
    setUint32(0x46_46_49_52); // "RIFF"
    setUint32(length - 8); // 文件长度 - 8
    setUint32(0x45_56_41_57); // "WAVE"

    // 写入 fmt 子块
    setUint32(0x20_74_6D_66); // "fmt " 字符串
    setUint32(16); // 子块的大小（16对于PCM格式是固定的）
    setUint16(1); // 音频格式（1表示PCM - 线性量化）
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // 字节率
    setUint16(numOfChan * 2); // 块对齐
    setUint16(16); // 比特数（对于PCM格式这意味着位深）

    // 写入 data 子块
    setUint32(0x61_74_61_64); // "data" 字符串
    setUint32(length - pos - 4); // 子块的大小（即实际音频数据的大小）

    // 函数用于以小端序写入数值

    // 分别写入每个通道的音频数据
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    // 写入交错的音频数据
    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // 音频剪切
        sample = Math.trunc(0.5 + sample < 0 ? sample * 32_768 : sample * 32_767); // 转换为 16 位
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return bufferOut;
  };

  // 转换 AudioBuffer 为 WAV
  const wavArrayBuffer = audioBufferToWav(audioBuffer);

  // 创建 Blob 对象
  const blob = new Blob([wavArrayBuffer], { type: 'audio/wav' });

  return blob;
};
