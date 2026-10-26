import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
test('approved sections remain present without the removed partners block',()=>{
 const ids=['top','lkm','applications','custom-order','tolling','factory','geography'];
 let previous=-1;
 for(const id of ids){const position=html.indexOf('id="'+id+'"');assert.ok(position>previous,'Missing or reordered section: '+id);previous=position;}
 assert.ok(html.indexOf('aria-labelledby="faq-title"')>previous);
 assert.ok(!html.includes('id="partners"'));
});
