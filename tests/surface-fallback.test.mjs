import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=(await readFile(new URL('../src/surfaces.js',import.meta.url),'utf8')).replace(/^import .*\n/,'').replaceAll('export function','function');

// A small DOM fixture runs the real gallery initializer, including async loads.
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.attributes={};this.className='';this.classList={add:name=>this.className+=' '+name,toggle(){}};}
 append(child){child.parent=this;this.children.push(child);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this);}
 setAttribute(name,value){this.attributes[name]=value;}
 removeAttribute(name){delete this.attributes[name];}
 addEventListener(){}
 getBoundingClientRect(){return {top:0,bottom:100};}
 querySelector(selector){return this.querySelectorAll(selector)[0];}
 querySelectorAll(selector){const matches=[];for(const child of this.children){if(selector.startsWith('.')?child.className.split(' ').includes(selector.slice(1)):child.tag===selector)matches.push(child);matches.push(...child.querySelectorAll(selector));}return matches;}
}

async function runFallback(working){
 const stage=new Element(),controls=new Element(),pause=new Element('button'),dots=new Element(),name=new Element(),note=new Element(),review=new Element();
 const first=new Element('figure');first.className='surface-slide is-current';const broken=new Element('img');broken.complete=true;broken.naturalWidth=0;first.append(broken);stage.append(first);
 const map={'.surface-stage':stage,'.surface-controls':controls,'.surface-pause':pause,'.surface-dots':dots,'.surface-name':name,'.surface-note':note,'.surface-review-note':review};
 const banner=new Element();banner.querySelector=selector=>map[selector];
 class Image extends Element{constructor(){super('img');}set src(value){queueMicrotask(()=>{if(working.has(value)){this.naturalWidth=600;this.onload?.();}else this.onerror?.();});}}
 const frames=Array.from({length:5},(_,i)=>({id:String(i),title:'Frame '+i,src:'/frame-'+i,approved:true,enabled:true,note:''}));
 const context={surfaceFrames:frames,document:{createElement:tag=>new Element(tag),hidden:false,querySelector:s=>s==='#surfaces'?banner:null,querySelectorAll:()=>[],addEventListener(){}},location:{search:''},matchMedia:q=>({matches:q.includes('reduced-motion'),addEventListener(){}}),window:{},innerHeight:800,addEventListener(){},Image,URLSearchParams,queueMicrotask,setTimeout,clearTimeout,setInterval,clearInterval};
 vm.runInNewContext(source+'\ninitializeSurfaceBanner();',context);
 await new Promise(resolve=>setImmediate(resolve));
 return {stage,controls,name,dots};
}

test('first and next images can fail while the last remaining image still loads in reduced motion',async()=>{
 const result=await runFallback(new Set(['/frame-4']));
 assert.equal(result.name.textContent,'Frame 4');
 assert.equal(result.stage.querySelectorAll('.surface-slide').length,1);
 assert.equal(result.controls.hidden,true);
 assert.equal(result.dots.children.filter(button=>button.disabled).length,4);
});

test('all failed sources leave an honest neutral fallback without broken images or controls',async()=>{
 const result=await runFallback(new Set());
 assert.equal(result.name.textContent,'Изображения временно недоступны');
 assert.equal(result.stage.querySelectorAll('img').length,0);
 assert.equal(result.controls.hidden,true);
});
