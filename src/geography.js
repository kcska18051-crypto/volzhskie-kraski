import {geographyCountries} from './geography-config.js?v=18';
export function getGeographyCountry(id){return geographyCountries.find(country=>country.id===id)||null;}
export function geographyContext(id){return getGeographyCountry(id)?.context||'Поставка в мой регион';}
export function initializeGeography(){
 const section=document.querySelector('#geography');if(!section)return;
 const controls=section.querySelector('.geo-country-controls'),cta=section.querySelector('.geo-copy a'),buttons=[...controls.querySelectorAll('button')],paths=[...section.querySelectorAll('.map-land .country')];
 let selected=null,hovered=null;
 const render=()=>{const focused=controls.contains(document.activeElement)?document.activeElement.dataset.country:null;const highlighted=hovered||focused||selected;section.querySelectorAll('.geo-map [data-country]').forEach(node=>node.classList.toggle('is-highlighted',node.dataset.country===highlighted));buttons.forEach(button=>{button.classList.toggle('is-highlighted',button.dataset.country===highlighted);button.setAttribute('aria-pressed',String(button.dataset.country===selected));});};
 function choose(id){if(!getGeographyCountry(id))return;selected=id;cta.dataset.context=geographyContext(id);render();}
 buttons.forEach((button,index)=>{
  button.addEventListener('click',()=>choose(button.dataset.country));
  button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=button.dataset.country;render();}});
  button.addEventListener('pointerleave',()=>{hovered=null;render();});
  button.addEventListener('keydown',event=>{let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%buttons.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index+buttons.length-1)%buttons.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=buttons.length-1;else return;event.preventDefault();buttons[next].focus();});
 });
 paths.forEach(path=>{path.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=path.dataset.country;render();}});path.addEventListener('pointerleave',()=>{hovered=null;render();});path.addEventListener('click',()=>choose(path.dataset.country));});
 controls.addEventListener('focusin',()=>{hovered=null;render();});controls.addEventListener('focusout',()=>queueMicrotask(render));section.classList.add('geo-interactive');controls.hidden=false;render();
}
