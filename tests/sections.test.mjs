import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
test('approved sections remain present, with permanent partners between geography and FAQ',()=>{
 const ids=['top','lkm','applications','custom-order','tolling','factory','geography','partners'];
 let previous=-1;
 for(const id of ids){const position=html.indexOf('id="'+id+'"');assert.ok(position>previous,'Missing or reordered section: '+id);previous=position;}
 assert.ok(html.indexOf('aria-labelledby="faq-title"')>previous);
 const section=html.match(/<section id="partners"[\s\S]*?<\/section>/)?.[0];
 assert.ok(section);assert.ok(!section.slice(0,section.indexOf('>')).includes(' hidden'));assert.ok(section.includes('Наши партнёры'));
});
