import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '..');

const clean = async (filename: string) => {
  if (existsSync(filename)) {
    unlinkSync(filename);
  }
};

clean(resolve(root, 'react.d.ts'));
clean(resolve(root, 'server.d.ts'));
