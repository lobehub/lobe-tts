import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

// @ts-ignore
const convertMarkdownToMdast = async (md: string) => {
  // @ts-ignore
  return unified().use(remarkParse).use(remarkGfm).parse(md.trim());
};

export const cleanContent = async (content: string) => {
  try {
    const mdast = await convertMarkdownToMdast(content.trim());
    const newContent: string[] = [];
    visit(mdast, 'text', (node: any) => {
      if (node?.value) newContent.push(node.value.trim());
    });
    return newContent.join('');
  } catch {
    return content.trim();
  }
};
