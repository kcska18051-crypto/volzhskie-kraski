import { surfaceFrames } from './surface-config.js?v=14';

export function selectSurfaceFrames(slots,review=false){const seen=new Set();return slots.filter(f=>{if(!f.id||!f.title?.trim()||!f.src?.trim()||seen.has(f.id))return false;if(!review&&(f.approved!==true||f.enabled!==true))return false;seen.add(f.id);return true;});}
export function canRunSurfaceMotion({count,inView,hidden,reduced,manualPause,hover,focus}){return count>1&&inView&&!hidden&&!reduced&&!manualPause&&!hover&&!focus;}
export function nextSurfaceIndex(current,length,failed){for(let step=1;step<=length;step++){const index=(current+step)%length;if(!failed.has(index))return index;}return current;}

export function initializeSurfaceBanner(){
 const banner=document.querySelector('#surfaces');if(!banner)return;
 const review=new URLSearchParams(location.search).get('surfaces')==='review';
 const frames=selectSurfaceFrames(surfaceFrames,review),stage=banner.querySelector('.surface-stage'),controls=banner.querySelector('.surface-controls'),pause=banner.querySelector('.surface-pause'),dots=banner.querySelector('.surface-dots'),name=banner.querySelector('.surface-name'),note=banner.querySelector('.surface-note');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:700px)');
 const failed=new Set(),preloads=new Map();let current=0,busy=false,manualPause=false,inView=false,timer;
 banner.querySelector('.surface-review-note').hidden=!review;
 banner.classList.toggle('has-notes',frames.some(f=>f.note||!f.approved));
 const count=()=>frames.filter((_,i)=>!failed.has(i)).length;
 const running=()=>!document.querySelector('dialog[open]')&&canRunSurfaceMotion({count:count(),inView,hidden:document.hidden,reduced:reduced.matches,manualPause,hover:false,focus:false});
 const caption=()=>{const frame=frames[current];name.textContent=frames.length&&count()===0?'Изображения временно недоступны':frame?.title||'';note.textContent=frame?(review&&!frame.approved?'На согласовании. '+(frame.note||'Основание не включено в публичный показ'):frame.note||''):'';dots.querySelectorAll('button').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===current));button.disabled=failed.has(i);});};
 const updateControls=()=>{controls.hidden=count()<2;pause.hidden=reduced.matches;pause.setAttribute('aria-pressed',String(manualPause));pause.textContent=manualPause?'▶':'Ⅱ';pause.setAttribute('aria-label',manualPause?'Продолжить':'Пауза');pause.setAttribute('title',manualPause?'Продолжить':'Пауза');};
 const nextIndex=()=>nextSurfaceIndex(current,frames.length,failed);
 function preloadNext(){const index=nextIndex();if(index!==current)load(frames[index]).catch(()=>{failed.add(index);caption();refresh();});}
 function refresh(){clearInterval(timer);timer=undefined;updateControls();if(running()){preloadNext();timer=setInterval(()=>show(nextIndex()),2500);}}
 function load(frame){const src=mobile.matches?frame.mobileSrc||frame.src:frame.src;if(!preloads.has(src))preloads.set(src,new Promise((resolve,reject)=>{const image=new Image();const timeout=setTimeout(()=>{image.onload=image.onerror=null;reject(new Error('Surface image timeout'));},10000);image.onload=()=>{clearTimeout(timeout);resolve();};image.onerror=()=>{clearTimeout(timeout);reject(new Error('Surface image unavailable'));};image.src=src;}));return preloads.get(src);}
 async function show(index,manual=false){
  if(busy||index===current||!frames[index]||failed.has(index))return;busy=true;
  try{
   const frame=frames[index];await load(frame);if(!manual&&!running())return;
   const picture=document.createElement('picture');if(frame.mobileSrc){const source=document.createElement('source');source.media='(max-width:700px)';source.srcset=frame.mobileSrc;picture.append(source);}const image=new Image();image.src=frame.src;image.alt=frame.alt||'';image.decoding='async';picture.append(image);
   const previous=stage.querySelector('.surface-slide');const next=document.createElement('figure');next.className='surface-slide';next.setAttribute('aria-hidden','true');next.append(picture);stage.append(next);
   if(reduced.matches){next.classList.add('is-current');previous?.remove();}
   else{next.getBoundingClientRect();next.classList.add('is-current');await new Promise(resolve=>setTimeout(resolve,750));previous?.remove();}
   next.removeAttribute('aria-hidden');current=index;caption();preloadNext();
  }catch{failed.add(index);caption();refresh();}
  finally{busy=false;if(count()>0&&!stage.querySelector('.surface-slide'))show(nextIndex(),true);}
 }
 frames.forEach((frame,index)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Показать: '+frame.title);button.setAttribute('aria-pressed',String(index===current));button.textContent=String(index+1);button.addEventListener('click',()=>{manualPause=true;refresh();show(index,true);});dots.append(button);});
 pause.addEventListener('click',()=>{manualPause=!manualPause;refresh();});
 document.addEventListener('visibilitychange',refresh);if('MutationObserver' in window)document.querySelectorAll('dialog').forEach(dialog=>new MutationObserver(refresh).observe(dialog,{attributes:true,attributeFilter:['open']}));reduced.addEventListener('change',()=>{refresh();if(reduced.matches&&current!==0&&!failed.has(0))show(0,true);});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;refresh();},{threshold:.05}).observe(banner);
 else{const check=()=>{const r=banner.getBoundingClientRect();inView=r.bottom>0&&r.top<innerHeight;refresh();};addEventListener('scroll',check,{passive:true});check();}
 const firstImage=stage.querySelector('img');
 const firstError=()=>{failed.add(0);stage.querySelector('.surface-slide')?.remove();caption();refresh();const candidate=nextIndex();if(candidate!==current)show(candidate,true);};
 firstImage?.addEventListener('error',firstError,{once:true});if(firstImage?.complete&&!firstImage.naturalWidth)firstError();
 if(!frames.length){stage.querySelector('.surface-slide')?.remove();name.textContent='';note.textContent='';controls.hidden=true;return;}
 caption();refresh();
}
