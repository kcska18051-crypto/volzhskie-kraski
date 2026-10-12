import test from 'node:test';import assert from 'node:assert/strict';import { createQuoteController } from '../src/quote.js';
test('one inquiry form returns home with its values and opener focus intact',()=>{
  let focused=0,prepared=0;const home={append(node){node.parentElement=this;}};const host={append(node){node.parentElement=this;}};const input={value:'Existing task',focus(){focused++;}};const form={parentElement:home,querySelector:()=>input};const opener={focus(){focused++;}};const dialog={open:false,showModal(){this.open=true;},close(){this.open=false;}};
  const control=createQuoteController({form,host,dialog,prepare(){prepared++;}});control.open(opener);assert.equal(form.parentElement,host);assert.equal(dialog.open,true);assert.equal(prepared,1);control.restore();assert.equal(form.parentElement,home);assert.equal(input.value,'Existing task');assert.equal(focused,2);
});
test('a second open cannot replace the original return-focus target',()=>{
  let first=0,second=0;const home={append(){}},host={append(){}};const form={parentElement:home,querySelector:()=>({focus(){}})};const dialog={open:false,showModal(){this.open=true;}};const control=createQuoteController({form,host,dialog});control.open({focus(){first++;}});control.open({focus(){second++;}});control.restore();assert.equal(first,1);assert.equal(second,0);
});
