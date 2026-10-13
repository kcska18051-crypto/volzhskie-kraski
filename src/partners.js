/** Render only client-approved originals. Empty or failed slots never reach visitors. */
export function mountPartners(slots, section = document.querySelector('#partners'), options = {}) {
  const grid = section.querySelector('.partners-grid');
  const note=section.querySelector('.partner-preview-note');
  if(note && note!==grid)note.hidden=true;
  grid.replaceChildren();
  section.hidden = true;
  const notify=()=>section.dispatchEvent(new Event('partnerschange'));
  if(options.preview && !slots.some(slot=>slot.approved===true && slot.name?.trim() && slot.src?.trim())){
    for(let i=0;i<Math.min(8,Math.max(4,slots.length));i++){const item=document.createElement('li');item.className='partner-placeholder';item.setAttribute('aria-hidden','true');grid.append(item);}
    section.hidden=false;section.querySelector('.partner-preview-note').hidden=false;notify();return;
  }
  for (const slot of slots) {
    if (slot.approved !== true || !slot.name?.trim() || !slot.src?.trim()) continue;
    const item = document.createElement('li');
    const image = document.createElement('img');
    image.alt = slot.name;
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
      notify();
    }, { once: true });
    item.append(image);
    grid.append(item);
    image.src = slot.src;
  }
}
