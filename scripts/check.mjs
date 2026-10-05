import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const pages=['index','article','image','video','textile','fashion'];
let references=0;
for(const name of pages){
 const file=await readFile(path.join(root,name+'.html'),'utf8');
 if(!file.includes('lang="ko"'))throw new Error(name+': language missing');
 if(!file.includes(`href="${name}.html" aria-current="page"`))throw new Error(name+': current navigation missing');
 const ids=[...file.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)throw new Error(name+': duplicate IDs');
 for(const match of file.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)){
  const target=match[1];if(target.startsWith('#')){if(!ids.includes(target.slice(1)))throw new Error(name+': missing anchor '+target);continue;}
  if(/^(https?:|data:|mailto:)/.test(target))continue;
  await access(path.resolve(root,target.split(/[?#]/)[0]));references++;
 }
 for(const match of file.matchAll(/data-dialog="([^"]+)"/g)){if(!ids.includes(match[1]))throw new Error(name+': missing dialog '+match[1]);}
 const nav=file.match(/<nav class="navigation"[^>]*>([\s\S]*?)<\/nav>/)[1];
 const hrefs=[...nav.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
 if(hrefs.join(',')!==pages.map(p=>p+'.html').join(','))throw new Error(name+': navigation order');
}
console.log(`PASS: 6 pages, navigation order, current-page states, dialogs, anchor targets, ${references} local asset/link references.`);
