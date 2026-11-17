export const noticeCookieName='vk_site_notice_v1';
export function hasAcceptedNotice(cookie){return String(cookie).split(';').some(item=>item.trim()===noticeCookieName+'=accepted');}
export function initializeSiteNotice(){
 const notice=document.querySelector('#site-notice');if(!notice||hasAcceptedNotice(document.cookie))return;
 notice.hidden=false;
 const update=()=>document.documentElement.style.setProperty('--site-notice-space',notice.hidden?'0px':notice.getBoundingClientRect().height+28+'px');
 update();const observer='ResizeObserver'in window?new ResizeObserver(update):null;observer?.observe(notice);
 notice.querySelector('.site-notice-accept').addEventListener('click',()=>{
  document.cookie=noticeCookieName+'=accepted; Max-Age=15552000; Path=/; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
  notice.hidden=true;update();observer?.disconnect();
 });
}
