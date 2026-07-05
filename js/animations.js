/* ============================================================
   NIS — animations.js
   Scroll reveals, animated counters, bar/chart fills, 3D tilt
   on solution cards, magnetic buttons, header scroll state.
   ============================================================ */

(function(){

  /* ---------- header scroll state ---------- */
  const header = document.querySelector('.site-header');
  if(header){
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -40px 0px' });
    revealEls.forEach(el=>io.observe(el));
  } else {
    revealEls.forEach(el=>el.classList.add('in'));
  }

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  if(counters.length){
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.counter);
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      const ease = t => 1 - Math.pow(1-t, 3);
      function tick(now){
        const p = Math.min((now-start)/duration, 1);
        const val = target * ease(p);
        el.textContent = val.toFixed(decimals) + suffix;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    if('IntersectionObserver' in window){
      const cio = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold:0.4 });
      counters.forEach(el=>cio.observe(el));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- bar fills (dashboard) ---------- */
  const bars = document.querySelectorAll('.bar-fill[data-width]');
  if(bars.length){
    const bio = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.style.width = entry.target.dataset.width + '%';
          bio.unobserve(entry.target);
        }
      });
    }, { threshold:0.3 });
    bars.forEach(b=>bio.observe(b));
  }

  /* ---------- 3D tilt on solution / dashboard cards ---------- */
  const tiltCards = document.querySelectorAll('.solution-card');
  tiltCards.forEach(card=>{
    const inner = card.querySelector('.tilt');
    if(!inner) return;
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.transform = `rotateY(${px*8}deg) rotateX(${-py*8}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', ()=>{
      inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  });

  /* ---------- magnetic buttons ---------- */
  const magnets = document.querySelectorAll('.btn-primary');
  magnets.forEach(btn=>{
    btn.addEventListener('mousemove', (e)=>{
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width/2) * 0.25;
      const y = (e.clientY - rect.top - rect.height/2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{
      btn.style.transform = 'translate(0,0)';
    });
  });

  /* ---------- module tabs (page2) ---------- */
  const tabs = document.querySelectorAll('.module-tab');
  if(tabs.length){
    tabs.forEach(tab=>{
      tab.addEventListener('click', ()=>{
        const target = tab.dataset.target;
        document.querySelectorAll('.module-tab').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('.module-panel').forEach(p=>p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(target);
        if(panel) panel.classList.add('active');
      });
    });
  }

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', ()=>{
      const open = navLinks.classList.toggle('mobile-open');
      navToggle.setAttribute('aria-expanded', open ? 'true':'false');
    });
  }

})();
