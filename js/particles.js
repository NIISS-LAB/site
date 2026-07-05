/* ============================================================
   NIS — particles.js
   Hexagonal neural lattice background. Nodes drift slowly and
   connect when within range, with slow energy pulses travelling
   along the connections. Reacts subtly to mouse position.
   ============================================================ */

(function(){
  const canvas = document.getElementById('lattice-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr;
  let nodes = [];
  let pulses = [];
  const NODE_COUNT_BASE = 46; // scaled by area
  const LINK_DIST = 170;
  const mouse = { x: -9999, y: -9999 };

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    buildNodes();
  }

  function buildNodes(){
    const area = width * height;
    const count = Math.max(18, Math.round(NODE_COUNT_BASE * (area / (1440*900))));
    nodes = [];
    for(let i=0;i<count;i++){
      nodes.push({
        x: Math.random()*width,
        y: Math.random()*height,
        vx: (Math.random()-0.5) * 0.12,
        vy: (Math.random()-0.5) * 0.12,
        r: Math.random()*1.6 + 1
      });
    }
  }

  function maybeSpawnPulse(){
    if(Math.random() > 0.985 && nodes.length > 1){
      const a = nodes[Math.floor(Math.random()*nodes.length)];
      const b = nodes[Math.floor(Math.random()*nodes.length)];
      const d = Math.hypot(a.x-b.x, a.y-b.y);
      if(a!==b && d < LINK_DIST){
        pulses.push({ a, b, t:0 });
      }
    }
  }

  function step(){
    for(const n of nodes){
      n.x += n.vx;
      n.y += n.vy;

      // gentle attraction away from mouse (parallax feel)
      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const d2 = dx*dx + dy*dy;
      if(d2 < 22000){
        const f = (22000 - d2) / 22000 * 0.02;
        n.x += dx * f * 0.02;
        n.y += dy * f * 0.02;
      }

      if(n.x < -20) n.x = width+20;
      if(n.x > width+20) n.x = -20;
      if(n.y < -20) n.y = height+20;
      if(n.y > height+20) n.y = -20;
    }
    maybeSpawnPulse();
    pulses.forEach(p => p.t += 0.012);
    pulses = pulses.filter(p => p.t < 1);
  }

  function draw(){
    ctx.clearRect(0,0,width,height);

    // links
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if(d < LINK_DIST){
          const alpha = (1 - d/LINK_DIST) * 0.35;
          ctx.strokeStyle = `rgba(95,168,232,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    // pulses travelling along connections
    for(const p of pulses){
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      const alpha = Math.sin(p.t * Math.PI);
      ctx.fillStyle = `rgba(150,205,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(x,y,2.2,0,Math.PI*2);
      ctx.fill();
    }

    // nodes
    for(const n of nodes){
      ctx.fillStyle = 'rgba(201,211,219,0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function loop(){
    if(!prefersReduced){
      step();
    }
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  loop();
})();
