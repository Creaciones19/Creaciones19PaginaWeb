
(() => {
  const c = document.getElementById('net');
  const ctx = c.getContext('2d', { alpha:true });

  let w, h, dpr, pts;

  // ===== AJUSTES “MÁS NOTORIO” =====
  const CFG = {
    density: 12000,      // menor = más puntos (antes 18000)
    minPts: 55,
    maxPts: 130,

    linkDist: 170,       // más distancia = más conexiones (antes 120)
    pointR: 2.1,         // tamaño punto (antes 2)
    speed: 0.55,         // velocidad (antes 0.7) -> más suave

    lineW: 1.35,         // grosor líneas
    lineA: 0.55,         // alpha base líneas (más fuerte)
    glowA: 0.22          // alpha glow (brillito)
  };

  function resize(){
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = c.clientWidth; h = c.clientHeight;

    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);

    const count = Math.round((w*h)/CFG.density);
    const n = Math.min(Math.max(count, CFG.minPts), CFG.maxPts);

    pts = Array.from({length: n}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-.5)*CFG.speed,
      vy: (Math.random()-.5)*CFG.speed
    }));
  }

  function step(){
    ctx.clearRect(0,0,w,h);

    // ===== PUNTOS =====
    for(const p of pts){
      p.x += p.vx; p.y += p.vy;

      if(p.x<0||p.x>w) p.vx *= -1;
      if(p.y<0||p.y>h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, CFG.pointR, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,.95)';
      ctx.fill();
    }

    // ===== LÍNEAS + GLOW =====
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const a=pts[i], b=pts[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist = Math.hypot(dx,dy);

        if(dist < CFG.linkDist){
          // intensidad según cercanía
          const t = 1 - (dist/CFG.linkDist);
          const alpha = (t*t) * CFG.lineA;

          // glow atrás (más grueso + transparente)
          ctx.strokeStyle = `rgba(255,255,255,${alpha * CFG.glowA})`;
          ctx.lineWidth = CFG.lineW * 3.2;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();

          // línea principal arriba (más fina)
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = CFG.lineW;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize();
  step();
})();


