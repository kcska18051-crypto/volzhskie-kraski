import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {tollingOperations,getTollingOperation,tollingContext} from '../src/tolling.js';

test('each operation produces its own editable inquiry context; unknown ids use the first operation',()=>{
 assert.equal(tollingOperations.length,3);
 assert.equal(new Set(tollingOperations.map(o=>o.id)).size,3);
 for(const operation of tollingOperations){
  assert.equal(getTollingOperation(operation.id),operation);
  assert.equal(tollingContext(operation.id),'Давальческая переработка: '+operation.title);
  assert.ok(operation.result.trim());
  for(const src of [operation.src,operation.mobileSrc]){assert.ok(src);assert.ok(existsSync(new URL('../public'+src,import.meta.url)),'Missing operation photo: '+src);}
 }
 assert.equal(getTollingOperation('missing'),tollingOperations[0]);
 assert.equal(tollingContext('missing'),tollingContext(tollingOperations[0].id));
});
