import test from 'node:test';import assert from 'node:assert/strict';import {selectSurfaceFrames,canRunSurfaceMotion} from '../src/surfaces.js';
const frame=(id,extra={})=>({id,title:id,src:'/assets/'+id+'.webp',enabled:true,approved:true,...extra});
test('surface publication requires approval and enablement; review is explicit',()=>{
 const list=[frame('steel'),frame('aluminium',{approved:false}),frame('plastic',{enabled:false}),frame('zinc',{enabled:false,approved:false})];
 assert.deepEqual(selectSurfaceFrames(list).map(f=>f.id),['steel']);assert.equal(selectSurfaceFrames(list,true).length,4);
 assert.equal(selectSurfaceFrames([frame('steel',{approved:'true'})]).length,0);
});
test('empty, single, multiple and duplicate surface configurations are supported',()=>{
 assert.equal(selectSurfaceFrames([]).length,0);assert.equal(selectSurfaceFrames([frame('a')]).length,1);assert.equal(selectSurfaceFrames([frame('a'),frame('b')]).length,2);
 assert.equal(selectSurfaceFrames([frame('a'),frame('a'),frame('b',{src:''}),frame('c',{title:' '})]).length,1);
});
test('automatic surface changes stop when offscreen, hidden, reduced or paused',()=>{
 const state={count:2,inView:true,hidden:false,reduced:false,manualPause:false,hover:false,focus:false};assert.equal(canRunSurfaceMotion(state),true);
 for(const stop of [{count:0},{count:1},{inView:false},{hidden:true},{reduced:true},{manualPause:true},{hover:true},{focus:true}])assert.equal(canRunSurfaceMotion({...state,...stop}),false);
 assert.equal(canRunSurfaceMotion({...state,manualPause:true,hover:false,focus:false}),false);
});
