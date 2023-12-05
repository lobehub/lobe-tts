// @ts-ignore
import jieba from 'jieba';
// @ts-ignore
import { _123, eng, removeStopwords, zho } from 'stopword';

// @ts-ignore
import { cleanContent } from '@/core/utils/cleanContent';
import { toHalfWidthAndCleanSpace } from '@/core/utils/splitTextIntoSegments';

export const compressString = async (content: string) => {
  let cleanedContent = await cleanContent(content);
  cleanedContent = toHalfWidthAndCleanSpace(cleanedContent);
  console.log(cleanedContent);
  const oldString = jieba.cut(cleanedContent, true);
  console.log(oldString);
  const compressContent = removeStopwords(oldString, [..._123, ...eng, ...zho]);
  return compressContent.join(' ');
};
