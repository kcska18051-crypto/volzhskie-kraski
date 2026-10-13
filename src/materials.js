/** Close material details before opening the existing inquiry dialog. */
export function initializeMaterials(){
 const dialog=document.querySelector('#material-dialog');if(!dialog?.showModal)return;
 const title=dialog.querySelector('h2'),cta=dialog.querySelector('.material-inquiry');let opener,handingOff=false;
 document.querySelectorAll('[data-material]').forEach(button=>{
  button.disabled=false;
  button.addEventListener('click',()=>{
   if(dialog.open||document.querySelector('#quote-dialog').open)return;
   opener=button;handingOff=false;const key=button.dataset.material;
   title.textContent=key==='acrylic'?'Акриловые эмали':'Алкидные эмали';
   dialog.querySelectorAll('[data-material-panel]').forEach(panel=>panel.hidden=panel.dataset.materialPanel!==key);
   cta.dataset.context=title.textContent;cta.dataset.returnFocus=button.id;
   dialog.showModal();dialog.scrollTop=0;document.body.classList.add('material-open');dialog.querySelector('.material-close').focus({preventScroll:true});
  });
 });
 cta.addEventListener('click',()=>{handingOff=true;dialog.close();});
 dialog.querySelector('.material-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('material-open');if(!handingOff)opener?.focus({preventScroll:true});});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const first=dialog.querySelector('.material-close'),last=cta;if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
}
