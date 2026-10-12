import { media, integration, partners } from './media-config.js';
import { mountPartners } from './partners.js';
import { industries, steps, customStages } from './content.js';
import { processScenes } from './process-scenes.js';
import { initializeForm } from './form.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobileMedia = matchMedia('(max-width: 700px)');

function mountMedia() {
  document.querySelectorAll('[data-media]').forEach((container) => {
    const slot = media[container.dataset.media];
    if (!slot?.desktop) return;
    container.querySelector('picture')?.remove();
    const picture = document.createElement('picture');
    if (slot.mobile) {
      const source = document.createElement('source');
      source.media = '(max-width: 700px)';
      source.srcset = slot.mobile;
      picture.append(source);
    }
    const img = document.createElement('img');
    img.src = slot.desktop;
    img.alt = slot.alt || '';
    img.decoding = 'async';
    img.style.objectPosition = mobileMedia.matches ? slot.mobilePosition || slot.position || 'center' : slot.position || 'center';
    const isHero = container.dataset.media === 'hero-poster';
    img.loading = isHero ? 'eager' : 'lazy';
    if (isHero) { img.fetchPriority = 'high'; img.width = 1536; img.height = 1024; }
    img.addEventListener('error', () => { picture.remove(); container.classList.remove('has-media'); });
    picture.append(img);
    container.append(picture);
    container.classList.add('has-media');
    if (slot.demonstration === false) container.querySelector('.material-media-caption')?.setAttribute('hidden','');
    if(container.classList.contains('custom-sample')){
      const stageVisual=container.closest('.custom-stage-visual');
      stageVisual.style.setProperty('--sample-image',`url("${slot.desktop}")`);
      if(slot.demonstration===false)stageVisual.querySelector('.custom-visual-caption small').hidden=true;
    }
    mobileMedia.addEventListener('change',()=>{ img.style.objectPosition=mobileMedia.matches?slot.mobilePosition||slot.position||'center':slot.position||'center'; });
    if (isHero && slot.demonstration === false) document.querySelector('.hero-caption').textContent = 'Производство «Волжские краски»';

    if (!slot.video?.desktop) return;
    const video = document.createElement('video');
    let inView = false;
    let pausedByUser = false;
    video.className = 'media-video';
    video.muted = true; video.loop = true; video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-hidden', 'true');
    const toggle = document.createElement('button');
    toggle.type = 'button'; toggle.className = 'video-toggle'; toggle.textContent = 'Включить видео';
    container.append(video, toggle);
    const updateVideoSource = () => {
      video.pause(); video.poster = mobileMedia.matches ? slot.mobile || slot.desktop : slot.desktop;
      const source = mobileMedia.matches ? slot.video.mobile : slot.video.desktop;
      if (!source) { video.removeAttribute('src'); video.hidden = true; toggle.hidden = true; return; }
      video.src = source; video.hidden = false; toggle.hidden = false;
      img.style.objectPosition = mobileMedia.matches ? slot.mobilePosition || slot.position || 'center' : slot.position || 'center';
      video.style.objectPosition = img.style.objectPosition;
      if (inView && !pausedByUser && !reducedMotion.matches && !navigator.connection?.saveData) video.play().catch(() => {});
    };
    video.addEventListener('play', () => { toggle.textContent = 'Приостановить видео'; });
    video.addEventListener('pause', () => { toggle.textContent = 'Включить видео'; });
    video.addEventListener('error', () => { video.hidden = true; toggle.hidden = true; });
    toggle.addEventListener('click', () => { if (video.paused) { pausedByUser=false;video.play().catch(() => {}); } else { pausedByUser=true;video.pause(); } });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) video.pause(); });
    mobileMedia.addEventListener('change', updateVideoSource);
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause();else if(inView&&!pausedByUser&&!reducedMotion.matches&&!navigator.connection?.saveData&&!video.hidden)video.play().catch(()=>{}); });
    new IntersectionObserver((entries) => { for (const entry of entries) { inView=entry.isIntersecting;if(!inView)video.pause();else if(!pausedByUser&&!reducedMotion.matches&&!navigator.connection?.saveData&&!video.hidden)video.play().catch(()=>{}); } }, {threshold:0.05}).observe(container);
    updateVideoSource();
  });
}

function initializeNavigation() {
  const menu = document.querySelector('#navigation');
  const toggle = document.querySelector('.menu-toggle');
  const desktop = matchMedia('(min-width:1051px)');
  const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Открыть меню'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open ? 'Закрыть меню' : 'Открыть меню');
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); } });
  document.addEventListener('click', (event) => { if (!event.target.closest('.header')) close(); });
  desktop.addEventListener('change', () => { if (desktop.matches) close(); });
  const links = [...menu.querySelectorAll('a')];
  const sections = links.map((link) => document.querySelector(link.hash));
  let scrollQueued = false;
  const onScroll = () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      document.querySelector('#header').classList.toggle('is-scrolled',scrollY>20);
      let active = -1;
      let closestTop = -Infinity;
      const threshold = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 130;
      sections.forEach((section,index) => { const top=section.getBoundingClientRect().top; if (top <= threshold && top > closestTop) { active=index; closestTop=top; } });
      links.forEach((link,index) => { link.classList.toggle('is-active',index===active); if (index===active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
      scrollQueued = false;
    });
  };
  document.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
}

function animatePanel(panel) {
  if (reducedMotion.matches) return;
  panel.classList.remove('panel-changing');
  requestAnimationFrame(() => panel.classList.add('panel-changing'));
}

function tabKeyboard(buttons, select, orientation = 'horizontal') {
  buttons.forEach((button,index) => button.addEventListener('keydown',(event) => {
    let next = index;
    if (event.key==='Home') next=0;
    else if (event.key==='End') next=buttons.length-1;
    else if (event.key===(orientation==='vertical'?'ArrowDown':'ArrowRight')) next=(index+1)%buttons.length;
    else if (event.key===(orientation==='vertical'?'ArrowUp':'ArrowLeft')) next=(index-1+buttons.length)%buttons.length;
    else return;
    event.preventDefault();select(next);buttons[next].focus({preventScroll:true});
  }));
}

function updateTabs(buttons,index,panel) {
  buttons.forEach((button,i) => { button.setAttribute('aria-selected',String(i===index)); button.tabIndex=i===index?0:-1; });
  panel.setAttribute('aria-labelledby',buttons[index].id);
}

function initializeIndustries() {
  const buttons = [...document.querySelectorAll('[data-industry]')];
  const panel = document.querySelector('#industry-panel');
  const visual = document.querySelector('#industry-visual');
  const image = document.querySelector('#industry-image');
  const source = document.querySelector('#industry-mobile-source');
  const fallback = document.createElement('span');
  fallback.className = 'industry-fallback';
  fallback.textContent = 'Зона для тематической фотографии';
  visual.append(fallback);
  let generation = 0;
  let selected = 0;
  const select = (index) => {
    selected = index;
    const currentGeneration = ++generation;
    const item = industries[index];
    updateTabs(buttons,index,panel);
    document.querySelector('#industry-title').textContent = item.title;
    document.querySelector('#industry-description').textContent = item.description;
    document.querySelector('#industry-hint').textContent = item.hint;
    document.querySelector('#industry-tag').textContent = item.tag;
    document.querySelector('#industry-counter').textContent = `${String(index+1).padStart(2,'0')} / 06`;
    document.querySelector('#industry-name').textContent = item.name;
    document.querySelector('#industry-cta-label').textContent = item.action;
    document.querySelector('#industry-cta').dataset.context = item.name;
    const slot = media[item.media];
    visual.classList.remove('is-loaded','is-unavailable');
    visual.classList.add('is-loading');
    document.querySelector('#industry-demo-caption').textContent = slot?.demonstration === false ? 'Направление применения' : 'Демонстрационный образ · не фото продукции предприятия';
    if (!slot?.desktop) { image.hidden=true;visual.classList.remove('is-loading');visual.classList.add('is-unavailable');return; }
    image.hidden=false;
    source.srcset=slot.mobile||slot.desktop;
    image.alt=slot.alt||item.name;
    image.style.objectPosition=mobileMedia.matches?slot.mobilePosition||slot.position||'center':slot.position||'center';
    image.src=slot.desktop;
    image.decode().then(()=>{if(generation===currentGeneration){visual.classList.remove('is-loading');visual.classList.add('is-loaded');}}).catch(()=>{if(generation===currentGeneration){image.hidden=true;visual.classList.remove('is-loading');visual.classList.add('is-unavailable');}});
    animatePanel(document.querySelector('.industry-detail'));
  };
  buttons.forEach((button,index)=>button.addEventListener('click',()=>select(index)));
  tabKeyboard(buttons,select,'vertical');select(0);
  mobileMedia.addEventListener('change',()=>{const slot=media[industries[selected].media];image.style.objectPosition=mobileMedia.matches?slot?.mobilePosition||slot?.position||'center':slot?.position||'center';});
}

function initializeSteps() {
  const buttons = [...document.querySelectorAll('[data-step]')];
  const panel = document.querySelector('#step-panel');
  const previous = document.querySelector('.step-prev');
  const next = document.querySelector('.step-next');
  let selected = 0;
  const select = (index) => {
    selected = index;
    const step = steps[index];
    updateTabs(buttons,index,panel);
    for (const field of ['kicker','title','description','output']) document.querySelector(`#step-${field}`).textContent=step[field];
    document.querySelector('#step-count').textContent = `${index+1} из 5`;
    const scene=processScenes[index];
    document.querySelector('#step-art').innerHTML=scene.art;
    document.querySelector('#step-scene-label').textContent=scene.label;
    const flow=document.querySelector('#step-scene-flow');
    flow.replaceChildren(...scene.flow.map((label,i)=>{const span=document.createElement('span');span.textContent=label;if(i%2)span.setAttribute('aria-hidden','true');return span;}));
    panel.dataset.activeStep=String(index);
    previous.disabled=index===0;next.disabled=index===steps.length-1;
    animatePanel(panel);
  };
  buttons.forEach((button,index)=>button.addEventListener('click',()=>select(index)));
  previous.addEventListener('click',()=>select(Math.max(0,selected-1)));
  next.addEventListener('click',()=>select(Math.min(steps.length-1,selected+1)));
  tabKeyboard(buttons,select);select(0);
}

function initializeCustomOrder() {
  const buttons=[...document.querySelectorAll('[data-custom]')];
  const panel=document.querySelector('#custom-panel');
  const select=(index)=>{
    const stage=customStages[index];
    updateTabs(buttons,index,panel);
    panel.dataset.stage=String(index);
    document.querySelector('#custom-stage-visual').dataset.stage=String(index);
    document.querySelector('#custom-kicker').textContent=stage.kicker;
    document.querySelector('#custom-title').textContent=stage.title;
    document.querySelector('#custom-description').textContent=stage.description;
    document.querySelector('#custom-keypoint').textContent=stage.point;
    document.querySelector('#custom-visual-label').textContent=stage.visual;
    document.querySelector('.custom-visual-caption small').textContent=index===3?'Цифровая схема сравнения цвета — не данные реальных партий':'Демонстрационный образ покрытия';
    animatePanel(document.querySelector('.custom-stage-content'));
  };
  buttons.forEach((button,index)=>button.addEventListener('click',()=>select(index)));
  tabKeyboard(buttons,select);select(0);
}

function initializeHeroDepth() {
  const hero=document.querySelector('.hero');
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
  let queued=false;
  let x=0;let y=0;
  hero.addEventListener('pointermove',(event)=>{
    if(reducedMotion.matches||!finePointer.matches)return;
    const box=hero.getBoundingClientRect();
    x=((event.clientX-box.left)/box.width-.5)*10;
    y=((event.clientY-box.top)/box.height-.5)*8;
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{hero.style.setProperty('--depth-x',`${x}px`);hero.style.setProperty('--depth-y',`${y}px`);queued=false;});
  },{passive:true});
  const reset=()=>{hero.style.setProperty('--depth-x','0px');hero.style.setProperty('--depth-y','0px');};
  hero.addEventListener('pointerleave',reset);
  reducedMotion.addEventListener('change',reset);
}

function initializeLegal() {
  const dialog = document.querySelector('#legal-dialog');
  const title = document.querySelector('#legal-title');
  const text = document.querySelector('#legal-text');
  document.querySelectorAll('[data-legal]').forEach((button) => button.addEventListener('click',() => {
    const privacy = button.dataset.legal==='privacy';
    const url = privacy?integration.privacyUrl:integration.consentUrl;
    if (url) { location.assign(url);return; }
    title.textContent=privacy?'Политика конфиденциальности':'Согласие на обработку данных';
    text.textContent='Утверждённый документ пока не предоставлен. Перед запуском сайта необходимо подключить документ оператора персональных данных. Сейчас данные формы не отправляются и не сохраняются на сайте';
    dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.dialog-dismiss').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',(event)=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
}

function initializeReveals() {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver((entries) => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible');observer.unobserve(entry.target); } },{rootMargin:'0px 0px -30px 0px',threshold:.08});
  document.querySelectorAll('.reveal').forEach((element)=>observer.observe(element));
}

mountPartners(partners);
mountMedia();initializeNavigation();initializeIndustries();initializeCustomOrder();initializeSteps();initializeForm();initializeLegal();initializeReveals();initializeHeroDepth();
const contextInput=document.querySelector('#request-context');
const contextMessage=document.querySelector('#inquiry-context');
const setContext=(value)=>{contextInput.value=value;contextMessage.hidden=!value;};
document.querySelector('#context-remove').addEventListener('click',()=>{setContext('');document.querySelector('#request-form input[name=service]:checked').focus();});
document.querySelectorAll('#request-form input[name="service"]').forEach(input=>input.addEventListener('change',()=>setContext('')));
document.querySelectorAll('[data-service]').forEach((link)=>link.addEventListener('click',()=>{
  const input=document.querySelector(`#request-form input[name="service"][value="${link.dataset.service}"]`);
  if(input){input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));}
  setContext(link.dataset.context||'');
}));
