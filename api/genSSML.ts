export type StyleName =
  | 'affectionate'
  | 'angry'
  | 'calm'
  | 'cheerful'
  | 'disgruntled'
  | 'embarrassed'
  | 'fearful'
  | 'general'
  | 'gentle'
  | 'sad'
  | 'serious';

export interface SsmlOptions {
  name: string;
  pitch?: number;
  rate?: number;
  style?: StyleName;
}

export const genSSML = (text: string, options: SsmlOptions) => {
  const { name, style, rate, pitch } = options;
  const ssml = [
    '<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">',
    `<voice name="${name}">`,
    style && `<mstts:express-as style="${style}">`,
    rate && pitch && `<prosody rate="${rate * 100}%" pitch="${pitch * 100}%">`,
    text,
    rate && pitch && `</prosody>`,
    style && `</mstts:express-as>`,
    `</voice>`,
    '</speak>',
  ];
  return ssml.filter(Boolean).join('');
};
