import test from 'node:test';
import assert from 'node:assert/strict';
import { mountPartners } from '../src/partners.js';
class Element extends EventTarget {
  children=[]; hidden=false; parent=null;
  append(child){child.parent=this;this.children.push(child);}
  replaceChildren(){this.children.forEach(child=>child.parent=null);this.children=[];}
  remove(){if(this.parent){this.parent.children=this.parent.children.filter(child=>child!==this);this.parent=null;}}
  contains(child){return this.children.includes(child);}
}
function fixture(){const grid=new Element(),section=new Element();section.querySelector=()=>grid;globalThis.document={createElement:()=>new Element()};return {grid,section};}
const approved=(name='Test geometry')=>({name,src:'/test.svg',approved:true});
test('empty and unapproved partners stay invisible',()=>{
  const {grid,section}=fixture();mountPartners([],section);assert.equal(section.hidden,true);
  mountPartners([{...approved(),approved:false},{...approved(),name:''},{...approved(),src:''}],section);
  assert.equal(section.hidden,true);assert.equal(grid.children.length,0);
});
test('only successfully loaded approved originals are shown; all failures hide the section',()=>{
  const {grid,section}=fixture();mountPartners([approved('A'),approved('B')],section);
  assert.equal(section.hidden,true);const [a,b]=grid.children;
  a.children[0].dispatchEvent(new Event('load'));assert.equal(a.hidden,false);assert.equal(section.hidden,false);assert.equal(a.children[0].alt,'A');
  b.children[0].dispatchEvent(new Event('error'));assert.equal(grid.children.length,1);assert.equal(section.hidden,false);
  a.children[0].dispatchEvent(new Event('error'));assert.equal(section.hidden,true);assert.equal(grid.children.length,0);
});
test('changing the list discards late loads from previous partner slots',()=>{
  const {grid,section}=fixture();mountPartners([approved()],section);const oldImage=grid.children[0].children[0];
  mountPartners([],section);oldImage.dispatchEvent(new Event('load'));
  assert.equal(grid.children.length,0);assert.equal(section.hidden,true);
});

test('approval preview uses anonymous slots and is opt-in',()=>{
 const {grid,section}=fixture();const note=new Element();section.querySelector=selector=>selector==='.partners-grid'?grid:note;
 globalThis.document.createElement=()=>{const e=new Element();e.setAttribute=()=>{};return e;};
 mountPartners(Array(8).fill({approved:false}),section,{preview:true});assert.equal(section.hidden,false);assert.equal(grid.children.length,8);assert.ok(grid.children.every(item=>item.className==='partner-placeholder'&&item.children.length===0));assert.equal(note.hidden,false);
 mountPartners([],section);assert.equal(section.hidden,true);assert.equal(grid.children.length,0);assert.equal(note.hidden,true);
});
