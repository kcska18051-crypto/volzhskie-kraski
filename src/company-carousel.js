export function carouselDestination(current,direction,last){return last<1?0:(current+direction+last+1)%(last+1);}
export function initializeCompanyCarousel(gallery){
 const track=gallery.querySelector('.company-photo-grid');
 if(!track||track.children.length<2)return;
 gallery.classList.add('is-process-carousel');gallery.setAttribute('role','region');gallery.setAttribute('aria-roledescription','карусель');gallery.setAttribute('aria-label','Этапы работы над заказом');
 track.id='company-process-track';track.tabIndex=0;track.setAttribute('aria-label','Фотографии этапов. Используйте стрелки влево и вправо или пролистывайте касанием.');
 const controls=document.createElement('div');controls.className='company-carousel-controls';
 const make=(label,text)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',label);b.setAttribute('aria-controls',track.id);b.textContent=text;controls.append(b);return b;};
 const prev=make('Предыдущие этапы','←'),next=make('Следующие этапы','→');gallery.append(controls);
 const align=()=>{gallery.style.setProperty('--process-photo-center',(track.querySelector('picture').getBoundingClientRect().top-gallery.getBoundingClientRect().top+track.querySelector('picture').getBoundingClientRect().height/2)+'px');};if('ResizeObserver'in window)new ResizeObserver(align).observe(track);align();
 initializeProcessLightbox(gallery,track);
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let visible=false,hovered=false,timer;
 const step=()=>{const cards=[...track.children];return cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth;};
 const move=direction=>{const size=step(),last=Math.ceil((track.scrollWidth-track.clientWidth)/size),current=Math.round(track.scrollLeft/size);const target=carouselDestination(current,direction,last);track.scrollTo({left:Math.min(target*size,track.scrollWidth-track.clientWidth),behavior:reduced.matches?'instant':'smooth'});};
 const schedule=()=>{clearInterval(timer);if(reduced.matches||!visible||hovered||gallery.contains(document.activeElement)||document.hidden)return;timer=setInterval(()=>{if(!document.querySelector('dialog[open]'))move(1);},3500);};
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
 gallery.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;schedule();}});gallery.addEventListener('pointerleave',()=>{hovered=false;schedule();});
 gallery.addEventListener('focusin',schedule);gallery.addEventListener('focusout',()=>setTimeout(schedule,0));document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.25}).observe(gallery);else{visible=true;}
 schedule();
}

function initializeProcessLightbox(gallery,track){
 const cards=[...track.querySelectorAll('figure')];let selected=0,opener,request=0,closing=false;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const dialog=document.createElement('dialog');dialog.className='process-lightbox';dialog.setAttribute('aria-label','Фотографии этапов работы над заказом');
 dialog.innerHTML='<button type="button" class="process-lightbox-close" aria-label="Закрыть галерею">×</button><div class="process-lightbox-stage"><img alt=""><button type="button" class="process-lightbox-prev" aria-label="Предыдущая фотография">←</button><button type="button" class="process-lightbox-next" aria-label="Следующая фотография">→</button></div><p class="process-lightbox-caption" aria-live="polite"></p>';
 document.body.append(dialog);const image=dialog.querySelector('img'),caption=dialog.querySelector('p'),close=dialog.querySelector('.process-lightbox-close');
 const show=async(index,initial=false)=>{selected=(index+cards.length)%cards.length;const ticket=++request,card=cards[selected],source=card.querySelector('img'),src=source.dataset.fullSrc||source.src;
 const apply=()=>{image.src=src;image.alt=source.alt;caption.textContent=card.querySelector('figcaption').textContent;};
 if(initial||reduced.matches){image.getAnimations().forEach(a=>a.cancel());apply();return;}
 const preload=new Image();preload.src=src;try{await preload.decode();}catch{return;}
 if(ticket!==request||!dialog.open||closing)return;
 image.getAnimations().forEach(a=>a.cancel());await image.animate([{opacity:1},{opacity:0}],{duration:90,easing:'ease-out',fill:'forwards'}).finished.catch(()=>{});
 if(ticket!==request||!dialog.open||closing)return;image.getAnimations().forEach(a=>a.cancel());apply();image.animate([{opacity:0},{opacity:1}],{duration:180,easing:'ease-out'});
 };
 const dismiss=async()=>{if(closing||!dialog.open)return;closing=true;++request;dialog.classList.add('is-closing');if(!reduced.matches)await dialog.animate([{opacity:1},{opacity:0}],{duration:160,easing:'ease-in'}).finished.catch(()=>{});dialog.close();dialog.classList.remove('is-closing');closing=false;};

 cards.forEach((card,index)=>{const picture=card.querySelector('picture'),button=document.createElement('button');button.type='button';button.className='process-photo-open';button.setAttribute('aria-label','Открыть фотографию: '+card.querySelector('figcaption').textContent);button.setAttribute('aria-haspopup','dialog');picture.before(button);button.append(picture);let downX=0;button.addEventListener('pointerdown',e=>{downX=e.clientX});button.addEventListener('click',e=>{if(e.detail&&Math.abs(e.clientX-downX)>15)return;opener=button;closing=false;show(index,true);dialog.showModal();if(!reduced.matches)dialog.animate([{opacity:0},{opacity:1}],{duration:200,easing:'ease-out'});document.body.classList.add('process-gallery-open');close.focus();});});
 close.addEventListener('click',dismiss);dialog.addEventListener('cancel',e=>{e.preventDefault();dismiss();});dialog.querySelector('.process-lightbox-prev').addEventListener('click',()=>show(selected-1));dialog.querySelector('.process-lightbox-next').addEventListener('click',()=>show(selected+1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();show(selected+(e.key==='ArrowRight'?1:-1));}});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss();});dialog.addEventListener('close',()=>{document.body.classList.remove('process-gallery-open');opener?.focus({preventScroll:true});});
 let x=0,y=0;image.addEventListener('touchstart',e=>{x=e.changedTouches[0].clientX;y=e.changedTouches[0].clientY;},{passive:true});image.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))show(selected+(dx<0?1:-1));},{passive:true});
}
