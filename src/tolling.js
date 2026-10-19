/** Documentary sources stay empty until real photographs are supplied. */
export const tollingOperations=[
 {id:'paste',title:'Диспергирование пигментных паст',description:'Диспергирование пигментных паст на производственном оборудовании по согласованным требованиям.',result:'Диспергирование пигментных паст на производственном оборудовании по согласованным требованиям.',src:null,mobileSrc:null,alt:'Диспергирование пигментной пасты на оборудовании Волжских красок',approved:false},
 {id:'components',title:'Компоненты и полуфабрикаты',description:'Изготовление согласованных компонентов из сырья заказчика для дальнейшего использования в его производстве.',result:'Изготовление согласованных компонентов из сырья заказчика для дальнейшего использования в его производстве.',src:null,mobileSrc:null,alt:'Изготовление компонентов на производстве Волжских красок',approved:false},
 {id:'other',title:'Другие технологические операции',description:'Рассмотрим вашу задачу и оценим возможность выполнения операции на оборудовании предприятия.',result:'Рассмотрим вашу задачу и оценим возможность выполнения операции на оборудовании предприятия.',src:null,mobileSrc:null,alt:'Согласованная технологическая операция на производстве Волжских красок',approved:false},
];
export function getTollingOperation(id){return tollingOperations.find(operation=>operation.id===id)||tollingOperations[0];}
export function tollingContext(id){return 'Давальческая переработка: '+getTollingOperation(id).title;}

export function initializeTolling(){
 const section=document.querySelector('#tolling');if(!section)return;
 const buttons=[...section.querySelectorAll('[data-operation]')],stage=section.querySelector('.tolling-media'),result=section.querySelector('.tolling-result'),cta=section.querySelector('.tolling-inquiry');
 function choose(id){
  const operation=getTollingOperation(id);
  buttons.forEach(button=>{const selected=button.dataset.operation===operation.id;button.disabled=false;button.setAttribute('aria-pressed',String(selected));button.tabIndex=selected?0:-1;});
  stage.dataset.slot='tolling-'+operation.id;stage.replaceChildren();stage.removeAttribute('aria-hidden');
  section.querySelector('#tolling-media-title').textContent=operation.title;
  const placeholder=()=>{const message=document.createElement('p');message.className='tolling-media-placeholder';message.textContent='Визуальные материалы готовятся';stage.append(message);};
  if(operation.approved&&operation.src){
   const picture=document.createElement('picture');
   if(operation.mobileSrc){const source=document.createElement('source');source.media='(max-width:700px)';source.srcset=operation.mobileSrc;picture.append(source);}
   const image=document.createElement('img');image.src=operation.src;image.alt=operation.alt;image.loading='lazy';image.addEventListener('error',()=>{picture.remove();if(stage.dataset.slot==='tolling-'+operation.id)placeholder();},{once:true});picture.append(image);stage.append(picture);
  }else placeholder();
  const detail=section.querySelector('.tolling-detail');
  detail.getAnimations?.().forEach(animation=>animation.cancel());
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&detail.animate)detail.animate([{opacity:.55},{opacity:1}],{duration:220,easing:'ease-out'});
  result.textContent=operation.result;cta.dataset.context=tollingContext(operation.id);
 }
 buttons.forEach((button,index)=>{
  button.addEventListener('click',()=>choose(button.dataset.operation));
  button.addEventListener('keydown',event=>{
   let next;
   if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%buttons.length;
   else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index+buttons.length-1)%buttons.length;
   else if(event.key==='Home')next=0;else if(event.key==='End')next=buttons.length-1;else return;
   event.preventDefault();choose(buttons[next].dataset.operation);buttons[next].focus();
  });
 });
 choose(tollingOperations[0].id);
}
