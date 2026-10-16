import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContact, validateAttachment, validateInquiry } from '../src/form.js';

test('accepts a single real contact method',()=>{
  for(const value of ['sales@example.ru',' +7 (4852) 58-76-54 ','8 999 123 45 67','+44 20 7946 0958','+1 (212) 555-0123'])assert.equal(validateContact(value),'');
  for(const value of ['','not-an-email','user@host','12345','+7 999 123 45 ab','++7 999 123 45 67','7+9991234567'])assert.notEqual(validateContact(value),'');
});
test('requires name and consent, allows optional company/task/file',()=>{
  assert.deepEqual(validateInquiry({name:'Анна',contact:'anna@example.ru',consent:true}),{});
  const errors=validateInquiry({name:'  ',contact:'wrong',consent:false});
  assert.deepEqual(Object.keys(errors),['name','contact','consent']);
});
test('rejects unsafe, empty and oversized attachments',()=>{
  assert.equal(validateAttachment(undefined),'');
  assert.equal(validateAttachment({name:'ТЗ.PDF',size:10*1024*1024}),'');
  for(const file of [{name:'file.exe',size:10},{name:'document.pdf.exe',size:10},{name:'task.pdf',size:0},{name:'task.pdf',size:10*1024*1024+1}])assert.notEqual(validateAttachment(file),'');
});
