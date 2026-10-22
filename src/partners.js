/** Approved logos, with an explicitly enabled neutral fallback for the permanent partners section. */
export function mountPartners(slots, section = document.querySelector('#partners'), options = {}) {
  const grid = section.querySelector('.partners-grid');
  const note=section.querySelector('.partner-preview-note');
  if(note && note!==grid)note.hidden=true;
  grid.replaceChildren();
  section.hidden = true;
  const notify=()=>section.dispatchEvent(new Event('partnerschange'));
  const showPlaceholders=()=>{grid.replaceChildren();for(let i=0;i<8;i++){const item=document.createElement('li');item.className='partner-placeholder';item.setAttribute('aria-hidden','true');grid.append(item);}section.hidden=false;notify();};
  if(options.placeholders && !slots.some(slot=>slot.approved===true && slot.name?.trim() && slot.src?.trim())){showPlaceholders();return;}
  if(options.preview && !slots.some(slot=>slot.approved===true && slot.name?.trim() && slot.src?.trim())){
    for(let i=0;i<Math.min(8,Math.max(4,slots.length));i++){const item=document.createElement('li');item.className='partner-placeholder';item.setAttribute('aria-hidden','true');grid.append(item);}
    section.hidden=false;section.querySelector('.partner-preview-note').hidden=false;notify();return;
  }
  for (const slot of slots) {
    if (slot.approved !== true || !slot.name?.trim() || !slot.src?.trim()) {
      if(options.placeholders){const empty=document.createElement('li');empty.className='partner-placeholder';empty.setAttribute('aria-hidden','true');grid.append(empty);section.hidden=false;}
      continue;
    }
    const item = document.createElement('li');
    const image = document.createElement('img');
    image.alt = '';
    item.className = 'partner-brand';
    const label = document.createElement('span');
    label.textContent = slot.name;
    image.decoding = 'async';
    item.hidden = true;
    image.addEventListener('load', () => {
      if (!grid.contains(item)) return;
      item.hidden = false;
      section.hidden = false;
      notify();
    }, { once: true });
    image.addEventListener('error', () => {
      item.remove();
      section.hidden = ![...grid.children].some(child => !child.hidden);
      if(options.placeholders && !grid.children.length){showPlaceholders();return;}
      notify();
    }, { once: true });
    item.append(image);
    item.append(label);
    grid.append(item);
    image.src = slot.src;
  }
}
