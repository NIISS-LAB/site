/* ============================================================
   NIS — main.js
   Loading sequence, AI Lab live feed simulation, dashboard
   charts (canvas line/area charts), contact form handling,
   active nav-link highlighting.
   ============================================================ */

(function(){

  /* ---------- loading screen ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if(loader){
      setTimeout(()=>{
        loader.classList.add('done');
        setTimeout(()=>loader.remove(), 700);
      }, 500);
    }
  });

  /* ---------- active nav link on scroll (index only) ---------- */
  const sections = document.querySelectorAll('main [id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if(sections.length && navAnchors.length && 'IntersectionObserver' in window){
    const map = {};
    navAnchors.forEach(a => map[a.getAttribute('href').slice(1)] = a);
    const nio = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        const link = map[entry.target.id];
        if(!link) return;
        if(entry.isIntersecting){
          navAnchors.forEach(a=>a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin:'-40% 0px -50% 0px' });
    sections.forEach(s=>nio.observe(s));
  }

  /* ---------- AI Lab live feed simulation ---------- */
  const feed = document.getElementById('ai-feed');
  if(feed){
    const events = [
      'model.inference :: batch_size=256 latency=11.4ms',
      'digital_twin.sync :: plant_unit=07 drift=0.002%',
      'anomaly_detect :: sensor_bank_A status=nominal',
      'vision.pipeline :: defect_scan frames=1440 ok',
      'predictive_maint :: pump_C4 remaining_life=812h',
      'optimizer.run :: energy_load reduced=-6.3%',
      'neural_net.train :: epoch=214 loss=0.0183',
      'scada.bridge :: packets_ok=99.98%',
      'fem.solver :: converged iterations=42',
      'cfd.mesh :: cells=18.4M residual=1e-6'
    ];
    let i = 0;
    function pushLine(){
      const div = document.createElement('div');
      const ts = new Date().toLocaleTimeString('en-GB',{hour12:false});
      div.textContent = `[${ts}] ${events[i % events.length]}`;
      feed.appendChild(div);
      i++;
      while(feed.children.length > 6){ feed.removeChild(feed.firstChild); }
      feed.scrollTop = feed.scrollHeight;
    }
    pushLine();
    setInterval(pushLine, 2200);
  }

  /* ---------- dashboard.js: mini canvas line charts (page1) ---------- */
  document.querySelectorAll('canvas.chart').forEach(canvas=>{
    const ctx = canvas.getContext('2d');
    function resize(){
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio||1,2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw(rect.width, rect.height);
    }
    function draw(w,h){
      ctx.clearRect(0,0,w,h);
      const points = 28;
      const data = [];
      let v = 0.5;
      for(let i=0;i<points;i++){
        v += (Math.random()-0.45)*0.12;
        v = Math.max(0.15, Math.min(0.95, v));
        data.push(v);
      }
      const pad = 10;
      const stepX = (w - pad*2) / (points-1);

      // area fill
      ctx.beginPath();
      ctx.moveTo(pad, h - pad - data[0]*(h-pad*2));
      data.forEach((d,idx)=>{
        ctx.lineTo(pad + idx*stepX, h - pad - d*(h-pad*2));
      });
      ctx.lineTo(pad + (points-1)*stepX, h-pad);
      ctx.lineTo(pad, h-pad);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0,0,0,h);
      grad.addColorStop(0, 'rgba(95,168,232,0.35)');
      grad.addColorStop(1, 'rgba(95,168,232,0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // line
      ctx.beginPath();
      data.forEach((d,idx)=>{
        const x = pad + idx*stepX, y = h - pad - d*(h-pad*2);
        if(idx===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.strokeStyle = '#5fa8e8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // grid lines
      ctx.strokeStyle = 'rgba(139,152,165,0.12)';
      ctx.lineWidth = 1;
      for(let g=1; g<4; g++){
        const y = pad + g*(h-pad*2)/4;
        ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(w-pad,y); ctx.stroke();
      }
    }
    resize();
    window.addEventListener('resize', resize);
  });


  /* ---------- contact form (REAL,backend) ---------- */

    function showToast(mensaje, tipo = 'exito') {
        const toast = document.getElementById('toast-message');
        const toastText = document.getElementById('toast-text');
        toastText.textContent = mensaje;
        toast.style.borderLeft = tipo === 'exito' ? '4px solid #22c55e' : '4px solid #ef4444';
        toast.style.display = 'block';
        toast.style.opacity = '1';

        setTimeout(() => {
            toast.style.transition = 'opacity 0.5s ease';
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 500);
        }, 3500);
    }

emailjs.init('h2JCBLfLDcEm5nGgH'); // te lo da EmailJS
const form = document.getElementById('contact-form');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;

    emailjs.sendForm('service_csmq2m8', 'template_lg4tl4q', form)
        .then(() => {
        showToast('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'exito');
        btn.textContent = 'Message sent';
        setTimeout(()=>{
          btn.textContent = original;
          btn.disabled = false;
          form.reset();
        }, 2600);
      })
        .catch((err) => {
        showToast('Hubo un error al enviar el mensaje. Intenta de nuevo.', 'error');
        btn.textContent = 'Error, intenta de nuevo';
        btn.disabled = false;
        console.error(err);
      });
  });
}



})();
