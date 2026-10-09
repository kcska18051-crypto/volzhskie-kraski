// Explanatory illustrations of information and material flow, not client equipment.
const scene = (body) => `<svg viewBox="0 0 520 300" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="paper" x1="120" y1="40" x2="320" y2="260" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#dce4ed"/></linearGradient><linearGradient id="steel" x1="250" y1="100" x2="400" y2="250" gradientUnits="userSpaceOnUse"><stop stop-color="#a7b7c9"/><stop offset=".45" stop-color="#eef3f7"/><stop offset="1" stop-color="#6e859f"/></linearGradient><linearGradient id="paint" x1="170" y1="70" x2="360" y2="230" gradientUnits="userSpaceOnUse"><stop stop-color="#ed5560"/><stop offset="1" stop-color="#a82431"/></linearGradient></defs>${body}</svg>`;

const document = `<path d="M143 41h124l30 31v178H143V41Z" fill="url(#paper)" stroke="#acbac9"/><path d="M267 41v31h30" stroke="#acbac9"/><path d="M169 96h96M169 122h96M169 149h63" stroke="#73869d" stroke-width="3"/><path d="M169 68h42" stroke="#e63742" stroke-width="5"/>`;
const vessel = `<ellipse cx="343" cy="130" rx="47" ry="16" fill="#c2cfdd" stroke="#6d839d"/><path d="M296 130v94c0 22 94 22 94 0v-94" fill="url(#steel)" stroke="#6d839d"/><ellipse cx="343" cy="130" rx="39" ry="11" fill="url(#paint)"/><path d="M312 160v53" stroke="#fff" stroke-opacity=".7" stroke-width="4"/>`;

export const processScenes = [
  {
    label:'Исходные данные заказчика', flow:['Требования','+','Сведения о сырье'],
    art:scene(`<ellipse cx="267" cy="261" rx="164" ry="14" fill="#c5d1df"/>${document}${vessel}<rect x="155" y="185" width="100" height="47" rx="2" transform="rotate(-12 155 185)" fill="url(#paint)"/><path d="m170 191 64-14" stroke="#fa9fa8" stroke-width="2"/>`),
  },
  {
    label:'Оценка технической возможности', flow:['Сырьё и задача','→','Техническая оценка'],
    art:scene(`<ellipse cx="250" cy="264" rx="162" ry="14" fill="#c5d1df"/>${vessel}<path d="M104 80h150v130H104z" fill="url(#paper)" stroke="#a9b7c8"/><path d="M125 110h80M125 138h80M125 166h56" stroke="#71879f" stroke-width="3"/><circle cx="262" cy="148" r="62" fill="#f3f5f7" stroke="#607791" stroke-width="9"/><path d="m305 193 48 45" stroke="#607791" stroke-width="14" stroke-linecap="round"/><path d="m237 147 18 19 38-40" stroke="#ce2937" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`),
  },
  {
    label:'Параметры согласованы до начала работ', flow:['Условия','+','Характеристики результата'],
    art:scene(`<ellipse cx="260" cy="262" rx="150" ry="14" fill="#c5d1df"/><g transform="translate(30 -4)">${document}</g><path d="m201 181 8 8 15-18M201 213l8 8 15-18" stroke="#607791" stroke-width="3"/><path d="M237 181h48M237 213h48" stroke="#607791" stroke-width="3"/><circle cx="331" cy="185" r="53" fill="#101d34"/><path d="m307 183 18 19 32-37" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M359 225l16 29-29-6-8 21-14-32" fill="#ce2937"/>`),
  },
  {
    label:'Выполнение согласованной операции', flow:['Сырьё','→','Операция','→','Материал'],
    art:scene(`<ellipse cx="260" cy="255" rx="197" ry="14" fill="#c5d1df"/><g transform="translate(-208 -10)">${vessel}</g><path d="M187 159h38m-10-9 10 9-10 9" stroke="#7389a1" stroke-width="3" stroke-linecap="round"/><circle cx="267" cy="149" r="49" fill="#101d34"/><path d="M241 137c10-15 43-15 53 0M241 150c10-15 43-15 53 0M241 163c10-15 43-15 53 0" stroke="#e63742" stroke-width="4" stroke-linecap="round"/><path d="M320 159h31m-10-9 10 9-10 9" stroke="#7389a1" stroke-width="3" stroke-linecap="round"/><g transform="translate(68 -10)">${vessel}</g>`),
  },
  {
    label:'Материал для следующего этапа заказчика', flow:['Компонент / полуфабрикат','→','Ваше производство'],
    art:scene(`<ellipse cx="261" cy="260" rx="161" ry="14" fill="#c5d1df"/>${vessel}<path d="m119 126 72-29 71 30-71 29-72-30Z" fill="#d4dee8" stroke="#7a8ea5"/><path d="M119 126v109l72 25 71-25V127l-71 29-72-30Z" fill="url(#paper)" stroke="#7a8ea5"/><path d="M191 156v104" stroke="#7a8ea5"/><path d="m156 112 73 29" stroke="#7a8ea5"/><path d="m142 192 13 14 24-28" stroke="#ce2937" stroke-width="5"/><rect x="276" y="80" width="97" height="48" rx="2" transform="rotate(-13 276 80)" fill="url(#paint)"/>`),
  },
];
