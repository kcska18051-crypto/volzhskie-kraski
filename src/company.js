import {companyGallery} from './media-config.js';
export function isCompanyMediaReady(frame){return frame.approved===true&&frame.enabled===true&&!!frame.src?.trim()&&(frame.type==='image'||(frame.type==='video'&&!!frame.poster?.trim()));}
export function selectCompanyMedia(slots,review=false){const seen=new Set();return slots.filter(frame=>{if(!frame.id||!frame.title?.trim()||!['image','video'].includes(frame.type)||seen.has(frame.id)||(!review&&!isCompanyMediaReady(frame)))return false;seen.add(frame.id);return true;});}
export function initializeCompanyGallery(){
 const gallery=document.querySelector('.company-gallery');if(!gallery)return;
 const review=new URLSearchParams(location.search).get('company')==='review',frames=selectCompanyMedia(companyGallery,review);
 if(!frames.length)return;
 gallery.hidden=false;gallery.closest('.company-layout').classList.add('has-gallery');gallery.querySelector('.company-review-note').hidden=!review;
 const stage=gallery.querySelector('.company-main'),caption=gallery.querySelector('.company-caption'),strip=gallery.querySelector('.company-thumbnails'),mobile=matchMedia('(max-width:700px)');let selected=-1,request=0;
 const buttons=[];
 function update(index){selected=index;buttons.forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===index));button.tabIndex=i===index?0:-1;});}
 function stopVideo(){stage.querySelector('video')?.pause();}
 function picture(src,mobileSrc,alt,frame){const p=document.createElement('picture');if(mobileSrc){const source=document.createElement('source');source.media='(max-width:700px)';source.srcset=mobileSrc;p.append(source);}const img=document.createElement('img');img.src=src;img.alt=alt||'';img.decoding='async';p.style.setProperty('--company-position',frame.position||'center');p.style.setProperty('--company-mobile-position',frame.mobilePosition||frame.position||'center');p.append(img);return p;}
 function readyImage(src,mobileSrc){return new Promise((resolve,reject)=>{const img=new Image();const timeout=setTimeout(()=>reject(new Error('Company image timeout')),10000);img.onload=()=>{clearTimeout(timeout);resolve();};img.onerror=()=>{clearTimeout(timeout);reject(new Error('Company image unavailable'));};img.src=mobile.matches?mobileSrc||src:src;});}
 async function choose(index){
  const frame=frames[index],ticket=++request;if(!frame)return;
  stopVideo();stage.setAttribute('aria-busy','true');
  if(!isCompanyMediaReady(frame)){stage.replaceChildren();caption.textContent=frame.title+' — '+(frame.type==='video'?'видео ожидается':'фотография ожидается');update(index);stage.removeAttribute('aria-busy');return;}
  try{
   const photoSrc=frame.type==='video'?frame.poster:frame.src,photoMobile=frame.type==='video'?frame.mobilePoster:frame.mobileSrc;
   await readyImage(photoSrc,photoMobile);if(ticket!==request)return;
   if(frame.type==='image')stage.replaceChildren(picture(frame.src,frame.mobileSrc,frame.alt,frame));
   else{const video=document.createElement('video');video.controls=true;video.preload='none';video.playsInline=true;video.muted=true;video.poster=mobile.matches?frame.mobilePoster||frame.poster:frame.poster;video.src=mobile.matches?frame.mobileSrc||frame.src:frame.src;video.setAttribute('aria-label',frame.alt||frame.title);video.style.setProperty('--company-position',frame.position||'center');video.style.setProperty('--company-mobile-position',frame.mobilePosition||frame.position||'center');const play=document.createElement('button');play.type='button';play.className='company-play';play.textContent='Смотреть видео';play.setAttribute('aria-label','Воспроизвести видео производства');play.addEventListener('click',()=>video.play().catch(()=>{caption.textContent=frame.title+' — видео недоступно';}));video.addEventListener('play',()=>play.hidden=true);video.addEventListener('pause',()=>play.hidden=false);video.addEventListener('ended',()=>play.hidden=false);video.addEventListener('error',()=>{if(stage.contains(video)){video.pause();stage.replaceChildren(picture(frame.poster,frame.mobilePoster,frame.alt,frame));caption.textContent=frame.title+' — видео недоступно';}});stage.replaceChildren(video,play);}
   caption.textContent=frame.title;update(index);
  }catch{if(ticket!==request)return;if(selected<0){stage.replaceChildren();caption.textContent=frame.title+' — кадр недоступен';update(index);}else caption.textContent=frames[selected].title+' — выбранный кадр недоступен';}
  finally{if(ticket===request)stage.removeAttribute('aria-busy');}
 }
 frames.forEach((frame,index)=>{const button=document.createElement('button');button.type='button';button.className='company-thumb';button.setAttribute('aria-label','Показать: '+frame.title);button.setAttribute('aria-controls','company-main');button.setAttribute('aria-pressed','false');button.tabIndex=index===0?0:-1;const tile=document.createElement('span');tile.className='company-thumb-tile';tile.setAttribute('aria-hidden','true');if(isCompanyMediaReady(frame)){const photo=picture(frame.type==='video'?frame.poster:frame.src,frame.type==='video'?frame.mobilePoster:frame.mobileSrc,'',frame);photo.querySelector('img').addEventListener('error',()=>photo.remove(),{once:true});tile.append(photo);}const label=document.createElement('span');label.className='company-thumb-label';label.textContent=frame.title;button.append(tile,label);button.addEventListener('click',()=>choose(index));button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%frames.length;else if(event.key==='ArrowLeft')next=(index+frames.length-1)%frames.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=frames.length-1;else return;event.preventDefault();buttons[next].focus();buttons[next].scrollIntoView({block:'nearest',inline:'nearest'});choose(next);});buttons.push(button);strip.append(button);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVideo();});if('IntersectionObserver' in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stopVideo();}).observe(gallery);
 choose(0);
}
