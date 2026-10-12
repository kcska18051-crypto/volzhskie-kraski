/** Render only client-approved originals. Empty or failed slots never reach visitors. */
export function mountPartners(slots, section = document.querySelector('#partners')) {
  const grid = section.querySelector('.partners-grid');
  grid.replaceChildren();
  section.hidden = true;
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
    }, { once: true });
    image.addEventListener('error', () => {
      item.remove();
      section.hidden = ![...grid.children].some(child => !child.hidden);
    }, { once: true });
    item.append(image);
    grid.append(item);
    image.src = slot.src;
  }
}
