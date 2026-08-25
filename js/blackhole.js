/* ============================================================
   BURACO NEGRO — tela de introdução
   Adaptado de um componente React/Framer para JavaScript puro.
   Disco de acreção com partículas orbitando em 3D.
   ============================================================ */

(function(){

  const DEFAULTS = {
    voidRadius: 65,        // raio do "horizonte de eventos" em px
    voidX: 50,             // posição horizontal do centro, em % da tela
    voidY: 45,             // posição vertical do centro, em % da tela
    particleCount: 850,    // número de partículas do disco
    particleSize: 4,       // tamanho base das partículas
    colors: ["#ffffff", "#c9bbff", "#8f7fd1"], // branco e tons de lavanda/roxo
    outerRadius: 280,      // raio externo do disco, % da metade da menor dimensão da tela
    tilt: 22,              // inclinação do disco
    tiltSideway: 160,      // rotação lateral do disco
    horizontalStretch: 1.5,  // >1 estica o disco pros lados (mantém a altura)
    trail: 50,             // rastro das partículas (0 sem rastro, 50 rastro máximo)
    orbitSpeed: 4,         // velocidade orbital
    pullSpeed: 0           // velocidade de queda em direção ao centro
  };
  const PERSPECTIVE = 1300;
  const BG = "#000000";

  function hexToRgb(colorStr){
    let r=0,g=0,b=0;
    if(!colorStr) return {r,g,b};
    if(colorStr[0] === '#'){
      const hex = colorStr.slice(1);
      if(hex.length === 3){
        r = parseInt(hex[0]+hex[0],16);
        g = parseInt(hex[1]+hex[1],16);
        b = parseInt(hex[2]+hex[2],16);
      } else if(hex.length >= 6){
        r = parseInt(hex.substring(0,2),16);
        g = parseInt(hex.substring(2,4),16);
        b = parseInt(hex.substring(4,6),16);
      }
    }
    return {r,g,b};
  }

  function initBlackHole(container, canvas, fgCanvas){
    const ctx = canvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d');
    let size = { w: container.clientWidth || window.innerWidth, h: container.clientHeight || window.innerHeight };
    let particles = [];
    let animId = null;
    let running = true;

    const voidRadius = DEFAULTS.voidRadius;
    const trailAlpha = Math.max(0.02, 1 - (DEFAULTS.trail/50) * 0.98);
    const tiltRad = DEFAULTS.tilt * Math.PI / 180;
    const tiltSidewayRad = DEFAULTS.tiltSideway * Math.PI / 180;

    function outerRadFromSize(w){
      const maxR = Math.min(w, size.h) / 2;
      const pct = Math.max(0, Math.min(100, DEFAULTS.outerRadius)) / 100;
      return voidRadius + pct * (maxR - voidRadius);
    }

    function initParticles(){
      const outerRad = outerRadFromSize(size.w);
      const pts = [];
      for(let i=0;i<DEFAULTS.particleCount;i++){
        const radius = voidRadius + Math.pow(Math.random(),2) * (outerRad - voidRadius);
        pts.push({
          angle: Math.random() * Math.PI * 2,
          radius,
          height: (Math.random()-0.5) * 16,
          speedOffset: 0.75 + Math.random() * 0.5,
          colorIdx: Math.floor(Math.random() * DEFAULTS.colors.length)
        });
      }
      particles = pts;
    }

    function resize(){
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w*dpr; canvas.height = h*dpr;
      canvas.style.width = w+'px'; canvas.style.height = h+'px';
      fgCanvas.width = w*dpr; fgCanvas.height = h*dpr;
      fgCanvas.style.width = w+'px'; fgCanvas.style.height = h+'px';
      size = { w, h };
      initParticles();
    }
    window.addEventListener('resize', resize);
    resize();

    let lastTime = performance.now();

    function draw(now){
      if(!running) return;
      const dt = Math.min((now-lastTime)/16.667, 3);
      lastTime = now;
      const { w, h } = size;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      fgCtx.setTransform(dpr,0,0,dpr,0,0);
      ctx.globalAlpha = 1; fgCtx.globalAlpha = 1;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${trailAlpha})`;
      ctx.fillRect(0,0,w,h);
      ctx.globalCompositeOperation = 'source-over';

      fgCtx.globalCompositeOperation = 'destination-out';
      fgCtx.fillStyle = `rgba(0,0,0,${trailAlpha})`;
      fgCtx.fillRect(0,0,w,h);
      fgCtx.globalCompositeOperation = 'source-over';

      const outerRad = outerRadFromSize(w);
      const voidCx = (DEFAULTS.voidX/100) * w;
      const voidCy = (DEFAULTS.voidY/100) * h;

      const bgPts = [], fgPts = [];

      for(let i=0;i<particles.length;i++){
        const pt = particles[i];
        const speedFactor = Math.sqrt(voidRadius / Math.max(pt.radius,10));
        const localOrbitSpeed = DEFAULTS.orbitSpeed * speedFactor * pt.speedOffset;
        pt.angle += localOrbitSpeed * 0.012 * dt;

        if(pt.radius < voidRadius){
          pt.radius = voidRadius + 0.7*(outerRad-voidRadius) + Math.random()*0.3*(outerRad-voidRadius);
          pt.angle = Math.random() * Math.PI * 2;
          pt.height = (Math.random()-0.5) * 16;
          continue;
        }

        const cosA = Math.cos(pt.angle), sinA = Math.sin(pt.angle);
        const xBase = pt.radius * cosA;
        const yBase = pt.height;
        const zBase = pt.radius * sinA;

        const x1 = xBase;
        const y1 = yBase*Math.cos(tiltRad) + zBase*Math.sin(tiltRad);
        const z1 = -yBase*Math.sin(tiltRad) + zBase*Math.cos(tiltRad);

        const x3d = x1*Math.cos(tiltSidewayRad) - y1*Math.sin(tiltSidewayRad);
        const y3d = x1*Math.sin(tiltSidewayRad) + y1*Math.cos(tiltSidewayRad);
        const z3d = z1;

        const scale = PERSPECTIVE / (PERSPECTIVE + z3d);
        const px = voidCx + (x3d * DEFAULTS.horizontalStretch) * scale;
        const py = voidCy + y3d*scale;

        if(px < -30 || px > w+30 || py < -30 || py > h+30) continue;

        const psize = Math.max(0.3, DEFAULTS.particleSize * scale);
        const alpha = Math.max(0.35, 1 - ((z3d+outerRad)/(2*outerRad)) * 0.45);
        const color = DEFAULTS.colors[pt.colorIdx % DEFAULTS.colors.length];

        const p = { x:px, y:py, size:psize, alpha, z:z3d, color };
        if(z3d >= 0) bgPts.push(p); else fgPts.push(p);
      }

      bgPts.sort((a,b)=>b.z-a.z);
      fgPts.sort((a,b)=>b.z-a.z);

      for(const p of bgPts){
        ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* esfera do horizonte de eventos */
      const voidRgb = hexToRgb(BG);
      const sphereGrad = ctx.createRadialGradient(
        voidCx - voidRadius*0.25, voidCy - voidRadius*0.3, voidRadius*0.05,
        voidCx, voidCy, voidRadius
      );
      const edgeR = Math.min(255, voidRgb.r+18), edgeG = Math.min(255, voidRgb.g+18), edgeB = Math.min(255, voidRgb.b+18);
      sphereGrad.addColorStop(0, `rgba(${Math.min(255,voidRgb.r+8)},${Math.min(255,voidRgb.g+8)},${Math.min(255,voidRgb.b+8)},1)`);
      sphereGrad.addColorStop(0.65, `rgba(${voidRgb.r},${voidRgb.g},${voidRgb.b},1)`);
      sphereGrad.addColorStop(0.92, `rgba(${edgeR},${edgeG},${edgeB},1)`);
      sphereGrad.addColorStop(1, `rgba(${edgeR},${edgeG},${edgeB},0.9)`);
      ctx.globalAlpha = 1; ctx.fillStyle = sphereGrad;
      ctx.beginPath(); ctx.arc(voidCx,voidCy,voidRadius,0,Math.PI*2); ctx.fill();

      /* brilho lavanda na borda (rim light) */
      const rimGrad = ctx.createRadialGradient(voidCx,voidCy,voidRadius*0.88, voidCx,voidCy,voidRadius*1.02);
      rimGrad.addColorStop(0, 'rgba(184,164,255,0)');
      rimGrad.addColorStop(0.6, 'rgba(184,164,255,0.08)');
      rimGrad.addColorStop(0.85, 'rgba(184,164,255,0.2)');
      rimGrad.addColorStop(1, 'rgba(184,164,255,0)');
      ctx.globalAlpha = 1; ctx.fillStyle = rimGrad;
      ctx.beginPath(); ctx.arc(voidCx,voidCy,voidRadius*1.02,0,Math.PI*2); ctx.fill();

      for(const p of fgPts){
        fgCtx.globalAlpha = p.alpha; fgCtx.fillStyle = p.color;
        fgCtx.beginPath(); fgCtx.arc(p.x,p.y,p.size,0,Math.PI*2); fgCtx.fill();
      }
      fgCtx.globalAlpha = 1;

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return {
      stop(){
        running = false;
        if(animId) cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
      }
    };
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    const container = document.getElementById('introScreen');
    const canvas = document.getElementById('bhCanvas');
    const fgCanvas = document.getElementById('bhFgCanvas');
    if(!container || !canvas || !fgCanvas) return;

    const handle = initBlackHole(container, canvas, fgCanvas);

    const introMusic = document.getElementById('introMusic');
    const enterBtn = document.getElementById('enterBtn');
    const introScreen = document.getElementById('introScreen');
    const mainContent = document.getElementById('mainContent');

    // toca a música assim que a página abre; a maioria dos navegadores
    // só bloqueia isso até a pessoa interagir (clicar/tocar na tela) uma
    // vez — então tentamos de novo automaticamente nesse primeiro toque
    if(introMusic){
      const tryAutoplay = ()=>{
        if(introScreen.classList.contains('hide')) return; // já saiu da tela de intro, não mexe mais
        if(!introMusic.paused) return;
        introMusic.volume = 0.5;
        introMusic.play().catch(()=>{ /* navegador bloqueou, espera interação */ });
      };
      tryAutoplay();
      ['click','touchstart','keydown'].forEach(evt=>{
        document.addEventListener(evt, tryAutoplay, { once:true });
      });
    }

    if(enterBtn){
      enterBtn.addEventListener('click', ()=>{
        introScreen.classList.add('hide');
        if(mainContent) mainContent.classList.add('reveal');

        if(introMusic && !introMusic.paused){
          const fade = setInterval(()=>{
            if(introMusic.volume > 0.05){
              introMusic.volume -= 0.05;
            } else {
              introMusic.pause();
              introMusic.volume = 0.5;
              clearInterval(fade);
            }
          }, 60);
          // trava de segurança: garante que pare mesmo se o fade falhar por algum motivo
          setTimeout(()=>{
            clearInterval(fade);
            introMusic.pause();
            introMusic.volume = 0.5;
          }, 900);
        }
        // a animação continua rodando (leve) para poder voltar depois
      });
    }

    // permite voltar à tela do buraco negro a partir da constelação
    window.showBlackHoleIntro = function(){
      introScreen.classList.remove('hide');
      if(mainContent) mainContent.classList.remove('reveal');
      const bgMusic = document.getElementById('bgMusic');
      if(bgMusic && !bgMusic.paused){ bgMusic.pause(); }
      if(introMusic && introMusic.paused){
        introMusic.volume = 0;
        introMusic.play().catch(()=>{});
        const fadeIn = setInterval(()=>{
          if(introMusic.volume < 0.5){
            introMusic.volume = Math.min(0.5, introMusic.volume + 0.05);
          } else {
            clearInterval(fadeIn);
          }
        }, 60);
      }
    };
  });

})();
