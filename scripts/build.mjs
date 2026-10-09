import { mkdir, cp, stat, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
for(const filename of ['index.html','src/main.js','src/styles.css','src/v2.css','src/media-config.js','src/form.js','src/content.js','src/process-scenes.js','public/assets/logo-original.png','public/assets/hero-poster.webp','public/assets/hero-mobile.webp','public/assets/onest-latin.woff2','public/assets/onest-cyrillic.woff2']){
  const info=await stat(path.join(root,filename));
  if(!info.size)throw new Error('Empty required file: '+filename);
}
for(const key of ['material-alkyd','material-acrylic','application-gates','application-racks','application-forklift','application-machinery','application-transport','application-railway']){
  for(const suffix of ['','-mobile'])await stat(path.join(root,'public','assets',key+suffix+'.webp'));
}
const html=await readFile(path.join(root,'index.html'),'utf8');
if(!html.includes('<html lang="ru">'))throw new Error('Missing Russian language declaration');
await mkdir(out,{recursive:true});
await cp(path.join(root,'index.html'),path.join(out,'index.html'));
await cp(path.join(root,'src'),path.join(out,'src'),{recursive:true});
await cp(path.join(root,'public','assets'),path.join(out,'assets'),{recursive:true,filter:(filename)=>!filename.endsWith('hero-concept.png')&&!filename.endsWith('.gitkeep')});
console.log('Static build ready: '+out);
