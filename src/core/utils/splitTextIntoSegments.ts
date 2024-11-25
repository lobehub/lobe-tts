import { markdownToTxt } from 'markdown-to-txt';

const toHalfWidthAndCleanSpace = (str: string): string => {
  return markdownToTxt(str)
    .replaceAll(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFE_E0))
    .replaceAll('\u3000', ' ')
    .replaceAll('。', '.')
    .replaceAll('，', ',')
    .replaceAll('！', '!')
    .replaceAll('？', '?')
    .replaceAll('；', ';')
    .replaceAll('：', ':')
    .replaceAll('（', '(')
    .replaceAll('）', ')')
    .replaceAll('【', '[')
    .replaceAll('】', ']')
    .replaceAll('《', '<')
    .replaceAll('》', '>')
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .replaceAll('‘', "'")
    .replaceAll('’', "'")
    .replaceAll('\n', '. ')
    .replaceAll(/\s+/g, ' ');
};

export const splitTextIntoSegments = (text: string, chunkSize: number = 100): string[] => {
  text = toHalfWidthAndCleanSpace(text);

  const chunks: string[] = [];
  const paragraphs = text.split('\n');
  let currentChunk = '';

  function addChunk(chunk: string) {
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
  }

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 1 > chunkSize && currentChunk.length > 0) {
      addChunk(currentChunk);
      currentChunk = '';
    }

    if (paragraph.length > chunkSize) {
      const sentences = paragraph.match(/[^!.?]+[!.?]+/g) || [paragraph];
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length + 1 > chunkSize && currentChunk.length > 0) {
          addChunk(currentChunk);
          currentChunk = '';
        }
        currentChunk += (currentChunk ? ' ' : '') + sentence.trim();
      }
    } else {
      currentChunk += (currentChunk ? '\n' : '') + paragraph;
    }
  }

  if (currentChunk) {
    addChunk(currentChunk);
  }

  return chunks;
};
