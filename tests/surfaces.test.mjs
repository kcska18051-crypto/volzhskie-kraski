import test from 'node:test';import assert from 'node:assert/strict';import {selectSurfaceFrames,canRunSurfaceMotion,nextSurfaceIndex} from '../src/surfaces.js';
import {surfaceFrames} from '../src/surface-config.js';
const frame=(id,extra={})=>({id,title:id,src:'/assets/'+id+'.webp',enabled:true,approved:true,...extra});
test('surface publication requires approval and enablement; review is explicit',()=>{
 const list=[frame('steel'),frame('aluminium',{approved:false}),frame('plastic',{enabled:false}),frame('zinc',{enabled:false,approved:false})];
 assert.deepEqual(selectSurfaceFrames(list).map(f=>f.id),['steel']);assert.equal(selectSurfaceFrames(list,true).length,4);
 assert.equal(selectSurfaceFrames([frame('steel',{approved:'true'})]).length,0);
});

test('two approved banner scenes keep cycling through multiple complete rounds',()=>{
 const frames=selectSurfaceFrames(surfaceFrames);
 assert.equal(frames.length,2);
 assert.ok(frames.every(f=>f.purpose==='discussion-example'));
 let current=0;const visited=[];
 for(let tick=0;tick<12;tick++){current=nextSurfaceIndex(current,frames.length,new Set());visited.push(current);}
 assert.deepEqual(visited,[1,0,1,0,1,0,1,0,1,0,1,0]);
 assert.equal(nextSurfaceIndex(3,5,new Set([4,0])),1);
 assert.equal(nextSurfaceIndex(2,5,new Set([0,1,3,4])),2);
 assert.equal(nextSurfaceIndex(0,0,new Set()),0);
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
