import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 获取当前模块文件的路径
const __filename = fileURLToPath(import.meta.url);

// 获取当前模块文件的目录路径
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, '..');

const entries = ['react', 'server'];

entries.forEach((name) => {
  writeFileSync(path.join(dir, `${name}.d.ts`), `export * from './es/${name}';`);
});
