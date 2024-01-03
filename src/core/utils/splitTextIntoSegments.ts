const toHalfWidthAndCleanSpace = (str: string): string => {
  return str
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

export const splitTextIntoSegments = (text: string, maxChars: number = 100): string[] => {
  text = toHalfWidthAndCleanSpace(text);

  const sentences = text.match(/[^.!;?]+[.!;?]+/g) || [];
  const segments: string[] = [];
  let currentSegment = '';

  sentences.forEach((sentence) => {
    if ((currentSegment + sentence).length > maxChars) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
      if (sentence.length > maxChars) {
        segments.push(sentence.trim());
      } else {
        currentSegment = sentence;
      }
    } else {
      currentSegment += sentence;
    }
  });

  if (currentSegment.length > 0) {
    segments.push(currentSegment.trim());
  }

  return segments.filter(Boolean);
};
