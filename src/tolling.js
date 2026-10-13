/** Documentary sources stay empty until real photographs are supplied. */
export const tollingOperations=[
 {id:'paste',title:'Перетир пигментных паст',description:'Работа с пастой на производственном оборудовании',result:'Пигментная паста после согласованного перетира — для следующего этапа вашего производства.',src:null,mobileSrc:null,alt:'Перетир пигментной пасты на оборудовании Волжских красок',approved:false},
 {id:'components',title:'Компоненты и полуфабрикаты',description:'Материал для следующего этапа заказчика',result:'Компонент или полуфабрикат по согласованным требованиям — для дальнейшей работы на вашем производстве.',src:null,mobileSrc:null,alt:'Изготовление компонентов на производстве Волжских красок',approved:false},
 {id:'other',title:'Другая технологическая операция',description:'Рассмотрение требований',result:'Материал после согласованной операции. Возможность выполнения и требования к результату определим по вашей задаче.',src:null,mobileSrc:null,alt:'Согласованная технологическая операция на производстве Волжских красок',approved:false},
];
export function getTollingOperation(id){return tollingOperations.find(operation=>operation.id===id)||tollingOperations[0];}
export function tollingContext(id){return 'Давальческая переработка: '+getTollingOperation(id).title;}

export function initializeTolling(){
 const section=document.querySelector('#tolling');if(!section)return;
 const buttons=[...section.querySelectorAll('[data-operation]')],stage=section.querySelector('.tolling-media'),result=section.querySelector('.tolling-result'),cta=section.querySelector('.tolling-inquiry');
 function choose(id){
  const operation=getTollingOperation(id);
  buttons.forEach(button=>{const selected=button.dataset.operation===operation.id;button.disabled=false;button.setAttribute('aria-pressed',String(selected));button.tabIndex=selected?0:-1;});
  stage.dataset.slot='tolling-'+operation.id;stage.replaceChildren();stage.setAttribute('aria-hidden',String(!(operation.approved&&operation.src)));
  if(operation.approved&&operation.src){
   const picture=document.createElement('picture');
   if(operation.mobileSrc){const source=document.createElement('source');source.media='(max-width:700px)';source.srcset=operation.mobileSrc;picture.append(source);}
   const image=document.createElement('img');image.src=operation.src;image.alt=operation.alt;image.loading='lazy';image.addEventListener('error',()=>picture.remove(),{once:true});picture.append(image);stage.append(picture);
  }
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
