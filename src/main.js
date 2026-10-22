import { initializeSiteNavigation } from './navigation.js';
import { initializeCompanyGallery } from './company.js?v=14';
import { initializeSurfaceBanner } from './surfaces.js?v=14';
import { initializeTolling } from './tolling.js?v=15';
import { initializeGeography } from './geography.js?v=18';
import { initializeMaterials } from './materials.js';
import { initializePartnerMarquee } from './partner-marquee.js?v=2';
import { mountQuoteDialog } from './quote.js';
import { media, integration, partners } from './media-config.js?v=16';
import { mountPartners } from './partners.js?v=2';
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

function initializeNavigation() { initializeSiteNavigation(); }

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
    const agreement = button.dataset.legal==='agreement';
    const url = agreement?integration.agreementUrl:privacy?integration.privacyUrl:integration.consentUrl;
    if (url) { location.assign(url);return; }
    title.textContent=agreement?'Пользовательское соглашение':privacy?'Политика конфиденциальности':'Согласие на обработку данных';
    text.textContent='Утверждённый документ пока не предоставлен. Перед запуском сайта необходимо подключить документ оператора персональных данных. Сейчас данные формы не отправляются и не сохраняются на сайте';
    if(agreement)text.textContent='Утверждённый текст пользовательского соглашения пока не предоставлен.';
    dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.dialog-dismiss').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',(event)=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
}

function initializeReveals(){
  if(reducedMotion.matches||!('IntersectionObserver' in window))return;
  const targets=[...document.querySelectorAll('.reveal,.geo-map')];
  let observer;
  const showAll=()=>{observer?.disconnect();targets.forEach(el=>{el.classList.remove('reveal-pending','geo-pending');if(el.classList.contains('geo-map'))el.closest('.geography')?.classList.remove('geo-motion');});};
  try{
    observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        const el=entry.target;
        if(el.classList.contains('geo-map'))el.closest('.geography').classList.add('geo-motion');
        else{el.classList.add('is-visible');el.addEventListener('transitionend',()=>el.classList.remove('reveal-pending'),{once:true});}
        observer.unobserve(el);
      }
    },{threshold:0,rootMargin:'0px 0px 100px 0px'});
    for(const el of targets){
      // Never hide content that is already on screen when JS starts.
      if(el.getBoundingClientRect().top<=innerHeight+100)continue;
      el.classList.add(el.classList.contains('geo-map')?'geo-pending':'reveal-pending');
      observer.observe(el);
    }
    reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)showAll();});
  }catch{showAll();}
}

initializePartnerMarquee();
mountPartners(partners,document.querySelector('#partners'),{placeholders:true});
initializeCompanyGallery();initializeSurfaceBanner();initializeTolling();initializeGeography();initializeMaterials();mountMedia();initializeNavigation();initializeForm();initializeLegal();initializeReveals();initializeHeroDepth();
const contextInput=document.querySelector('#request-context');
const contextMessage=document.querySelector('#inquiry-context');
const setContext=(value)=>{contextInput.value=value;contextMessage.hidden=!value;};
document.querySelector('#context-remove').addEventListener('click',()=>{setContext('');document.querySelector('#request-form input[name=name]').focus();});
document.querySelectorAll('#request-form input[name="service"]').forEach(input=>input.addEventListener('change',()=>setContext('')));
document.querySelectorAll('[data-service]').forEach((link)=>link.addEventListener('click',()=>{
  const input=document.querySelector(`#request-form input[name="service"][value="${link.dataset.service}"]`);
  if(input){input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));}
  setContext(link.dataset.context||'');
}));

mountQuoteDialog(link=>{if(link.dataset.quote==='kp'){setContext('');document.querySelector('#request-form input[name=service][value=other]').checked=true;}document.querySelector('#navigation').classList.remove('is-open');const toggle=document.querySelector('.menu-toggle');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню');});
