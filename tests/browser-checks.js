/** Run with Playwright's Page and an axe-core source string. No production dependencies. */
export async function runBrowserChecks(page, axeSource) {
  const report = { viewports:[], interactions:[] };
  const check = (name,passed) => { report.interactions.push({name,passed:!!passed});if(!passed)throw new Error(name); };
  for (const width of [1920,1440,1366,1280,1024,768,390,375]) {
    await page.setViewportSize({width,height:1000});
    await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
    for(const image of await page.locator('img').all()){
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(el=>el.decode().catch(()=>null));
    }
    await page.evaluate(()=>scrollTo({top:document.body.scrollHeight,behavior:'instant'}));
    await page.waitForFunction(()=>[...document.images].every(img=>img.complete));
    const state=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(img=>img.complete&&!img.naturalWidth).map(img=>img.src)}));
    report.viewports.push(state);
    if(state.scrollWidth>width||state.brokenImages.length)throw new Error('Viewport problem '+width);
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Открыть меню',exact:true}).click();
  check('mobile menu opens',await page.locator('#navigation').isVisible());
  await page.keyboard.press('Escape');
  check('Escape closes menu',!(await page.locator('#navigation').isVisible()));
  await page.getByRole('button',{name:'Открыть меню',exact:true}).click();
  await page.locator('#navigation a[href="#tolling"]').click();
  check('anchor closes menu',!(await page.locator('#navigation').isVisible()));
  await page.waitForFunction(()=>document.querySelector('#navigation a[href="#tolling"]').getAttribute('aria-current')==='location');
  check('tolling navigation active',await page.locator('#navigation a[href="#tolling"]').getAttribute('aria-current')==='location');
  await page.locator('[data-industry="0"]').focus();
  await page.keyboard.press('End');
  check('industry keyboard selects railway repair',await page.locator('#industry-tag').textContent()==='Ремонтная окраска');
  check('railway certification caveat',(await page.locator('#industry-hint').textContent()).includes('не заявляется'));
  const applicationSources=[];
  for(let i=0;i<6;i++){
    await page.locator(`[data-industry="${i}"]`).click();
    await page.waitForFunction(()=>document.querySelector('#industry-visual').classList.contains('is-loaded'));
    applicationSources.push(await page.locator('#industry-image').getAttribute('src'));
    check('application '+i+' uses a readable image',await page.locator('#industry-image').evaluate(el=>el.complete&&el.naturalWidth>0));
  }
  check('all six application images are distinct',new Set(applicationSources).size===6);
  await page.locator('#industry-cta').click();
  check('application CTA carries request context',await page.locator('#request-context').inputValue()==='Ремонт железнодорожного транспорта');
  await page.locator('#context-remove').click();
  check('request context can be removed',await page.locator('#request-context').inputValue()===''&&!(await page.locator('#inquiry-context').isVisible()));
  await page.locator('[data-custom="0"]').focus();
  await page.keyboard.press('End');
  check('custom order keyboard selects batch',await page.locator('#custom-panel').getAttribute('data-stage')==='3');
  check('custom batch explains stable colour',(await page.locator('#custom-keypoint').textContent()).includes('Стабильность цвета'));
  await page.locator('[data-custom="1"]').click();
  check('custom order changes tangible visual',await page.locator('#custom-stage-visual').getAttribute('data-stage')==='1');
  await page.locator('[data-step="0"]').focus();
  await page.keyboard.press('ArrowRight');
  check('process keyboard changes step',await page.locator('#step-count').textContent()==='2 из 5');
  check('process illustration follows selected step',await page.locator('#step-scene-label').textContent()==='Оценка технической возможности');
  await page.getByRole('button',{name:'Следующий этап',exact:true}).click();
  check('process arrow changes step',await page.locator('#step-count').textContent()==='3 из 5');
  await page.locator('[data-step="4"]').click();
  check('last step cannot advance',await page.locator('.step-next').isDisabled());
  const faq=page.locator('.faq details').nth(3);
  await faq.locator('summary').click();
  check('FAQ disclosure opens',await faq.getAttribute('open')!==null);
  await page.locator('.tolling [data-service="tolling"]').click();
  check('service CTA selects tolling request',await page.locator('input[name="service"][value="tolling"]').isChecked());
  await page.locator('.form-submit').click();
  check('empty form shows errors',await page.locator('#name-error').textContent()==='Укажите ваше имя');
  await page.locator('input[name="name"]').fill('Анна');
  await page.locator('input[name="contact"]').fill('anna@example.ru');
  await page.locator('input[name="consent"]').check();
  await page.locator('#attachment').setInputFiles({name:'Техническое задание.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4 demo')});
  check('file label updates',(await page.locator('#file-label').textContent()).includes('Техническое'));
  await page.locator('.file-remove').click();
  check('file remove works',await page.locator('#file-label').textContent()==='Прикрепить ТЗ или документ');
  await page.locator('.form-submit').click();
  check('unconnected form does not imitate sending',await page.locator('#form-status').getAttribute('data-state')==='unconnected'&&(await page.locator('#form-status').textContent()).includes('запрос не отправлен'));
  await page.locator('[data-legal="privacy"]').first().click();
  check('legal dialog opens',await page.locator('#legal-dialog').isVisible());
  await page.keyboard.press('Escape');
  check('legal dialog closes with Escape',!(await page.locator('#legal-dialog').isVisible()));
  await page.evaluate(async()=>{(await import('/src/media-config.js')).integration.requestEndpoint='/test-inquiry';});
  await page.route('**/test-inquiry',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({success:false})}));
  await page.locator('.form-submit').click();
  await page.waitForFunction(()=>document.querySelector('#form-status').dataset.state==='error');
  check('failed backend keeps user data',await page.locator('#form-status').getAttribute('data-state')==='error'&&await page.locator('input[name="name"]').inputValue()==='Анна');
  await page.unroute('**/test-inquiry');
  await page.route('**/test-inquiry',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true})}));
  await page.locator('.form-submit').click();
  await page.waitForFunction(()=>document.querySelector('#form-status').dataset.state==='success');
  check('confirmed backend response shows success',await page.locator('#form-status').getAttribute('data-state')==='success');
  await page.unroute('**/test-inquiry');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.reload({waitUntil:'networkidle'});
  check('reduced motion disables hero animation',await page.locator('.hero-copy').evaluate(el=>getComputedStyle(el).animationName)==='none');
  await page.addScriptTag({content:axeSource});
  const audit=async()=>await page.evaluate(async()=>{
    const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
    return result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
  });
  report.mobileAccessibility=await audit();
  await page.setViewportSize({width:1440,height:1000});
  report.desktopAccessibility=await audit();
  check('mobile automated accessibility',report.mobileAccessibility.length===0);
  check('desktop automated accessibility',report.desktopAccessibility.length===0);
  return report;
}
