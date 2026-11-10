import test from 'node:test';import assert from 'node:assert/strict';import { createQuoteController } from '../src/quote.js';
test('one inquiry form returns home with its values and opener focus intact',()=>{
  let focused=0,prepared=0;const home={append(node){node.parentElement=this;}};const host={append(node){node.parentElement=this;}};const input={value:'Existing task',focus(){focused++;}};const form={parentElement:home,querySelector:()=>input};const opener={focus(){focused++;}};const dialog={open:false,showModal(){this.open=true;},close(){this.open=false;}};
  const control=createQuoteController({form,host,dialog,prepare(){prepared++;}});control.open(opener);assert.equal(form.parentElement,host);assert.equal(dialog.open,true);assert.equal(prepared,1);control.restore();assert.equal(form.parentElement,home);assert.equal(input.value,'Existing task');assert.equal(focused,2);
});
test('a second open cannot replace the original return-focus target',()=>{
  let first=0,second=0;const home={append(){}},host={append(){}};const form={parentElement:home,querySelector:()=>({focus(){}})};const dialog={open:false,showModal(){this.open=true;}};const control=createQuoteController({form,host,dialog});control.open({focus(){first++;}});control.open({focus(){second++;}});control.restore();assert.equal(first,1);assert.equal(second,0);
});

test('material handoff returns focus to the visible details button',()=>{
 let hiddenLinkFocus=0,visibleButtonFocus=0;const home={append(){}},host={append(){}};const form={parentElement:home,querySelector:()=>({focus(){}})};const dialog={open:false,showModal(){this.open=true;}};
 const control=createQuoteController({form,host,dialog});control.open({focus(){hiddenLinkFocus++;}},{focus(){visibleButtonFocus++;}});control.restore();assert.equal(hiddenLinkFocus,0);assert.equal(visibleButtonFocus,1);
});


test('the source layout is reserved before moving the form and released on return',()=>{
 const events=[];const home={append(){events.push('home');}},host={append(){events.push('host');}};
 const form={parentElement:home,querySelector:()=>({focus(){}})},dialog={open:false,showModal(){this.open=true;}};
 const control=createQuoteController({form,host,dialog,reserve(){events.push('reserve');},release(){events.push('release');}});
 control.open({focus(){}});assert.deepEqual(events,['reserve','host']);
 control.restore();assert.deepEqual(events,['reserve','host','home','release']);
});

test('a failed dialog opening releases the reserved source layout',()=>{
 let released=0;const home={append(){}},host={append(){}};
 const form={parentElement:home},dialog={open:false,showModal(){throw new Error('unavailable');}};
 const control=createQuoteController({form,host,dialog,release(){released++;}});
 assert.equal(control.open({}),false);assert.equal(released,1);
});
