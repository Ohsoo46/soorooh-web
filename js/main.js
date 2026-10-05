(() => {
  const menu=document.querySelector('.menu-toggle');
  const nav=document.querySelector('#navigation');
  const closeMenu=()=>{menu?.setAttribute('aria-expanded','false');nav?.classList.remove('is-open');};
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
  matchMedia('(min-width: 961px)').addEventListener('change',closeMenu);
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.querySelectorAll('[data-filter-group]').forEach(group=>{
    const grid=document.getElementById(group.dataset.filterGroup);
    const status=document.getElementById(group.dataset.filterGroup+'-status');
    group.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
      group.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      let count=0;grid.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
      if(status)status.textContent=`${String(count).padStart(2,'0')} PROJECTS`;
    }));
  });
  let opener;
  document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>{
    const dialog=document.getElementById(button.dataset.dialog);if(!dialog)return;
    opener=button;dialog.showModal();document.documentElement.classList.add('dialog-open');
  }));
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.querySelector('[data-close]')?.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>{dialog.querySelectorAll('video').forEach(v=>v.pause());document.documentElement.classList.remove('dialog-open');opener?.focus();});
  });
  const slider=document.querySelector('#comparison-range');
  slider?.addEventListener('input',()=>{document.querySelector('.comparison').style.setProperty('--split',slider.value+'%');slider.setAttribute('aria-valuetext',`스케치 ${slider.value}%, 비주얼 ${100-slider.value}%`);});
  document.querySelectorAll('[data-motion]').forEach(button=>button.addEventListener('click',()=>{
    const film=document.querySelector('#motion-stage');const paused=film.classList.toggle('paused');button.textContent=paused?'재생하기':'일시 정지';button.setAttribute('aria-pressed',String(!paused));
  }));
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.08});
    document.querySelectorAll('[data-reveal]').forEach(el=>{el.classList.add('will-reveal');observer.observe(el);});
  }
})();
