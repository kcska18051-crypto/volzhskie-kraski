/** The section at the reading line owns navigation; unmapped sections clear it. */
export function activeNavigationSection(sections,line,atEnd=false){
 if(atEnd)return '#contacts';
 return sections.findLast(section=>section.top<=line&&section.bottom>line)?.target||null;
}
export function initializeSiteNavigation(){
 const header=document.querySelector('#header'),menu=document.querySelector('#navigation'),toggle=header.querySelector('.menu-toggle');
 const desktop=matchMedia('(min-width:1151px)'),links=[...menu.querySelectorAll('a')];
 const targets={lkm:'#lkm',applications:'#applications',tolling:'#tolling',factory:'#factory',contacts:'#contacts'};
 const sections=[...document.querySelectorAll('main > section')];let queued=false,pendingTarget=null,settleTimer;
 const settle=()=>{clearTimeout(settleTimer);pendingTarget=null;refresh();};
 const awaitSettle=()=>{clearTimeout(settleTimer);settleTimer=setTimeout(settle,180);};
 const close=(restore=false)=>{menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню');if(restore)toggle.focus();};
 toggle.addEventListener('click',()=>{if(toggle.getAttribute('aria-expanded')==='true'){close(true);return;}menu.classList.add('is-open');toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Закрыть меню');links[0].focus();});
 links.forEach(link=>link.addEventListener('click',()=>{close();pendingTarget=link.hash;refresh();awaitSettle();const target=document.querySelector(link.hash);if(target){target.setAttribute('tabindex','-1');setTimeout(()=>target.focus({preventScroll:true}),0);}}));
 document.addEventListener('keydown',event=>{if(toggle.getAttribute('aria-expanded')!=='true')return;if(event.key==='Escape'){event.preventDefault();close(true);}else if(event.key==='Tab'){const items=[...header.querySelectorAll('a,button')].filter(el=>el.getClientRects().length&&!el.disabled);const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
 document.addEventListener('click',event=>{if(!header.contains(event.target))close();});
 desktop.addEventListener('change',()=>{const focused=menu.contains(document.activeElement);close();if(!desktop.matches&&focused)toggle.focus();});
 const refresh=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;const line=header.getBoundingClientRect().bottom+16;document.documentElement.style.setProperty('--navigation-offset',line+'px');header.classList.toggle('is-scrolled',scrollY>20);const active=pendingTarget||activeNavigationSection(sections.map(section=>{const r=section.getBoundingClientRect();return {top:r.top,bottom:r.bottom,target:targets[section.id]||null};}),line+2,scrollY>0&&scrollY+innerHeight>=document.documentElement.scrollHeight-2);links.forEach(link=>{const selected=link.hash===active;link.classList.toggle('is-active',selected);if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});});};
 document.addEventListener('scroll',()=>{refresh();if(pendingTarget)awaitSettle();},{passive:true});
 document.addEventListener('scrollend',settle);
 addEventListener('wheel',settle,{passive:true});addEventListener('touchstart',settle,{passive:true});
 document.addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))settle();});addEventListener('resize',refresh);addEventListener('hashchange',refresh);addEventListener('pageshow',refresh);
 if('ResizeObserver' in window)new ResizeObserver(refresh).observe(header);
 refresh();
}
