// Optional development QA. Production has no browser automation dependency.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const location=process.env.SOOROOH_PLAYWRIGHT;
if(!location)throw new Error('Set SOOROOH_PLAYWRIGHT to playwright/index.mjs.');
const {chromium}=await import(pathToFileURL(location).href);
const browser=await chromium.launch({channel:'msedge',headless:true});
await mkdir('tmp/qa',{recursive:true});
const results=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:width>600?1000:844});
  for(const name of ['index','article','image','video','textile','fashion']){
   await page.goto(`http://127.0.0.1:4173/${name}.html`);await page.waitForLoadState('networkidle');
   assert.equal(await page.locator('h1').count(),1);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name} overflow at ${width}`);
   assert.ok(await page.locator('img').evaluateAll(images=>images.filter(i=>i.getClientRects().length&&(i.loading!=='lazy'||i.getBoundingClientRect().top<innerHeight)).every(i=>i.complete&&i.naturalWidth>0)),`${name}: broken image`);
   if(width===1440||width===390)await page.screenshot({path:`tmp/qa/${name}-${width}.png`,fullPage:false});
   results.push(`${name} ${width}px: no overflow, main heading, images loaded`);
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173');
 await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
 await page.locator('#navigation a[href="textile.html"]').click();await page.waitForURL('**/textile.html');
 for(const category of ['floral','geometric','abstract','texture']){await page.locator(`[data-filter="${category}"]`).click();assert.equal(await page.locator('#textile-grid .gallery-item:visible').count(),1);assert.equal(await page.locator('#textile-grid-status').textContent(),'01 PROJECTS');}
 await page.locator('[data-filter="all"]').click();assert.equal(await page.locator('#textile-grid .gallery-item:visible').count(),4);
 await page.locator('[data-dialog="soft-geometry"]').click();assert.ok(await page.locator('#soft-geometry').evaluate(d=>d.open));await page.keyboard.press('Escape');assert.equal(await page.locator('#soft-geometry').evaluate(d=>d.open),false);assert.equal(await page.evaluate(()=>document.activeElement.dataset.dialog),'soft-geometry');
 results.push('Mobile navigation, four textile filters, reset, project dialog, Escape and focus return passed.');
 await page.goto('http://127.0.0.1:4173/image.html');await page.locator('[data-filter="product"]').click();assert.equal(await page.locator('#image-grid .gallery-item:visible').count(),1);
 await page.goto('http://127.0.0.1:4173/article.html');await page.locator('[data-dialog="small-brand"]').click();assert.equal(await page.locator('#small-brand .article-body section').count(),4);await page.locator('#small-brand [data-close]').click();
 await page.goto('http://127.0.0.1:4173/fashion.html');await page.locator('#comparison-range').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#comparison-range').inputValue(),'51');assert.equal(await page.locator('.comparison').evaluate(e=>e.style.getPropertyValue('--split')),'51%');
 results.push('Image filtering, full article reading and keyboard comparison slider passed.');
 await page.goto('http://127.0.0.1:4173/video.html');await page.locator('[data-dialog="quiet-motion"]').click();const video=page.locator('video');
 await video.evaluate(v=>v.play());await page.waitForFunction(()=>document.querySelector('video').currentTime>.3);
 assert.ok(await video.evaluate(v=>!v.error&&v.videoWidth>0));await page.locator('#quiet-motion [data-close]').click();assert.equal(await video.evaluate(v=>v.paused),true);
 results.push('MP4 decoded and played; closing dialog pauses playback.');
 assert.deepEqual(errors,[]);results.push('No browser JavaScript errors or HTTP failures.');
 await writeFile('tmp/qa/results.json',JSON.stringify(results,null,2));console.log(results.join('\n'));
}finally{await browser.close()}
