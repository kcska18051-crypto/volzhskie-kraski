import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeGeography} from '../src/geography.js';

function fixture(t){
 const previous=globalThis.document,doc={activeElement:null};
 t.after(()=>{globalThis.document=previous;});
 class Node{
  constructor(country){this.dataset={country};this.attributes={};this.listeners={};this.classes=new Set();this.classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)};}
  addEventListener(name,listener){(this.listeners[name]??=[]).push(listener);}
  setAttribute(name,value){this.attributes[name]=value;}
  emit(name,event={}){this.listeners[name]?.forEach(listener=>listener(event));}
  focus(){doc.activeElement=this;controls.emit('focusin');}
 }
 const ids=['RUS','BLR','KAZ'],buttons=ids.map(id=>new Node(id)),paths=ids.map(id=>new Node(id)),labels=ids.map(id=>new Node(id)),cta=new Node(),controls=new Node();
 cta.dataset.context='Поставка в мой регион';controls.hidden=true;controls.contains=node=>buttons.includes(node);controls.querySelectorAll=()=>buttons;
 const section={classList:{add(){}},querySelector:selector=>selector==='.geo-country-controls'?controls:cta,querySelectorAll:selector=>selector==='.map-land .country'?paths:[...paths,...labels]};
 doc.querySelector=()=>section;globalThis.document=doc;initializeGeography();return {doc,buttons,paths,labels,cta,controls};
}

test('hover softly highlights without choosing a destination; touch country activation persists a choice',t=>{
 const f=fixture(t);assert.equal(f.controls.hidden,false);
 f.paths[1].emit('pointerenter',{pointerType:'mouse'});
 assert.ok(f.paths[1].classes.has('is-highlighted'));assert.ok(f.labels[1].classes.has('is-highlighted'));
 assert.equal(f.cta.dataset.context,'Поставка в мой регион');assert.ok(f.buttons.every(button=>button.attributes['aria-pressed']==='false'));
 f.paths[1].emit('pointerleave');assert.ok(f.paths.every(path=>!path.classes.has('is-highlighted')));
 f.paths[2].emit('pointerenter',{pointerType:'touch'});assert.ok(!f.paths[2].classes.has('is-highlighted'));
 f.paths[2].emit('click');assert.equal(f.cta.dataset.context,'Поставка в Казахстан');assert.equal(f.buttons[2].attributes['aria-pressed'],'true');assert.ok(f.paths[2].classes.has('is-highlighted'));
});

test('keyboard focus and arrows highlight; activation chooses the country and preserves it after focus leaves',async t=>{
 const f=fixture(t);f.paths[2].emit('pointerenter',{pointerType:'mouse'});f.buttons[0].focus();assert.ok(f.paths[0].classes.has('is-highlighted'));
 let prevented=false;f.buttons[0].emit('keydown',{key:'ArrowRight',preventDefault(){prevented=true;}});
 assert.equal(prevented,true);assert.equal(f.doc.activeElement,f.buttons[1]);assert.ok(f.paths[1].classes.has('is-highlighted'));assert.equal(f.cta.dataset.context,'Поставка в мой регион');
 f.buttons[1].emit('click');assert.equal(f.cta.dataset.context,'Поставка в Беларусь');
 f.doc.activeElement=f.cta;f.controls.emit('focusout');await Promise.resolve();assert.ok(f.paths[1].classes.has('is-highlighted'));assert.equal(f.buttons[1].attributes['aria-pressed'],'true');
});
