// Development-only asset tool. Requires Playwright; production has no dependencies.
import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const location=process.env.SOOROOH_PLAYWRIGHT;
if(!location)throw new Error('Set SOOROOH_PLAYWRIGHT to the installed playwright/index.mjs path.');
const {chromium}=await import(pathToFileURL(location).href);
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
  const page=await browser.newPage();
  await page.goto('http://127.0.0.1:4173');
  const result=await page.evaluate(async()=>{
    const image=new Image();image.src='/assets/images/editorial.webp';await image.decode();
    const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;
    const context=canvas.getContext('2d');const types=['video/mp4;codecs=avc1.42E01E','video/mp4'];const mime=types.find(t=>MediaRecorder.isTypeSupported(t));if(!mime)throw new Error('MP4 recording unsupported');
    const stream=canvas.captureStream(24);const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:3500000});const chunks=[];
    recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    const finished=new Promise(resolve=>recorder.onstop=resolve);
    const draw=t=>{const zoom=1+t*.065;const w=1280*zoom,h=image.height/image.width*w;context.fillStyle='#b5af9f';context.fillRect(0,0,1280,720);context.drawImage(image,(1280-w)*.68,(720-h)*.5,w,h);};
    draw(0);recorder.start();const start=performance.now();await new Promise(resolve=>{const frame=now=>{const t=Math.min((now-start)/8000,1);draw(t);if(t<1)requestAnimationFrame(frame);else resolve();};requestAnimationFrame(frame)});recorder.stop();await finished;stream.getTracks().forEach(t=>t.stop());
    const bytes=new Uint8Array(await new Blob(chunks,{type:mime}).arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(binary);
  });
  await writeFile('assets/videos/quiet-form.mp4',Buffer.from(result,'base64'));
  console.log('Created assets/videos/quiet-form.mp4');
}finally{await browser.close()}
