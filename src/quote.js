/** Reuse the page's single form, preserving entered data and event listeners. */
export function createQuoteController({form,host,dialog,prepare=()=>{},reserve=()=>{},release=()=>{}}){
  const home=form.parentElement;let opener;
  return {
    open(link,returnFocus=link){if(dialog.open)return false;opener=returnFocus;reserve();prepare(link);host.append(form);try{dialog.showModal();}catch{home.append(form);release();return false;}form.querySelector('input[name="name"]').focus({preventScroll:true});return true;},
    restore(){home.append(form);release();opener?.focus({preventScroll:true});},
  };
}
export function mountQuoteDialog(prepare){
  const dialog=document.querySelector('#quote-dialog');if(!dialog?.showModal)return;
  const updateScrollState=()=>dialog.classList.toggle('is-scrolled',dialog.scrollTop>0);
  dialog.addEventListener('scroll',updateScrollState,{passive:true});
  const form=document.querySelector('#request-form');
  let placeholder;
  const reserve=()=>{
    placeholder=document.createElement('div');placeholder.className='request-form-placeholder';placeholder.setAttribute('aria-hidden','true');
    placeholder.style.height=form.getBoundingClientRect().height+'px';form.before(placeholder);
  };
  const release=()=>{placeholder?.remove();placeholder=undefined;};
  const controller=createQuoteController({form,host:document.querySelector('#quote-form-host'),dialog,prepare,reserve,release});
  document.querySelectorAll('a[href="#request"]').forEach(link=>link.addEventListener('click',event=>{
    document.querySelector('#quote-title').textContent=link.dataset.context?.includes('TDS')?'Запросить техническое описание':link.dataset.quote==='kp'?'Запросить КП':'Обсудить задачу';
    if(controller.open(link,link.dataset.returnFocus?document.getElementById(link.dataset.returnFocus)||link:link)){event.preventDefault();dialog.scrollTop=0;updateScrollState();document.body.classList.add('quote-open');}
  }));
  form.querySelectorAll('input[name=service]').forEach(input=>input.addEventListener('change',()=>{if(dialog.open)document.querySelector('#quote-title').textContent='Запросить КП';}));
  dialog.querySelector('.quote-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.classList.remove('quote-open');controller.restore();});
  dialog.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const focusable=[...dialog.querySelectorAll('button,input,textarea,select,a[href]')].filter(el=>!el.disabled&&el.type!=='hidden'&&el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
}
