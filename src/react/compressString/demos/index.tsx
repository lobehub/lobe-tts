import { compressString } from '@lobehub/tts/react';
import { TokenTag } from '@lobehub/ui';
import { Input } from 'antd';
import { encode } from 'gpt-tokenizer';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import useSWR from 'swr';

export default () => {
  const [text, setText] = useState('');
  const { data, isLoading } = useSWR(text, () => compressString(text));

  const token = encode(text).length;
  const compressedToken = data && encode(data).length;

  return (
    <Flexbox align={'center'} gap={8} style={{ width: '100%' }}>
      <Input.TextArea onChange={(e) => setText(e.target.value)} value={text} />
      <TokenTag displayMode={'used'} maxValue={16_000} value={token} />
      {!isLoading && data && (
        <>
          <Input.TextArea value={data} />
          <TokenTag displayMode={'used'} maxValue={16_000} value={compressedToken} />
          <div>
            Save: {compressedToken - token} ({Math.floor(((token - compressedToken) / token) * 100)}
            %)
          </div>
        </>
      )}
    </Flexbox>
  );
};
