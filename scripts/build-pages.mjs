import './build.mjs';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// GitHub project Pages lives under a repository subdirectory.
const out = fileURLToPath(new URL('../dist/', import.meta.url));
const base = '/volzhskie-kraski/';
async function rewrite(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await rewrite(filename);
    else if (/\.(html|css|js)$/.test(entry.name)) {
      const source = await readFile(filename, 'utf8');
      await writeFile(filename, source.replaceAll('/assets/', base + 'assets/').replaceAll('/src/', base + 'src/'));
    }
  }
}
await rewrite(out);
await writeFile(path.join(out, '.nojekyll'), '');
