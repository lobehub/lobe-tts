import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '..');

const build = async (filename: string) => {
  copyFileSync(filename, filename.replace('.js', '.d.ts'));
};

build(resolve(root, 'react.js'));
build(resolve(root, 'server.js'));
