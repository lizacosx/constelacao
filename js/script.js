/* ============================================================
   NOSSA CONSTELAÇÃO — signo de Virgem
   Edite a seção "PERSONALIZE AQUI" com suas memórias e fotos.
   ============================================================ */

/* ---------- PERSONALIZE AQUI ---------- */

const NOME_DELA = "mozi";

// Cada objeto é uma estrela/memória, na ordem em que serão desbloqueadas.
// A ordem já foi pensada para desenhar o formato da constelação de Virgem
// corretamente — não precisa mudar a ordem, só o conteúdo de cada uma.
// "image": coloque o caminho da foto, ex: "assets/fotos/foto1.jpg"
const MEMORIES = [
  {
    date: "O começo de tudo",
    title: "O dia em que você chegou",
    text: "Hoje é o dia em que o mundo ganhou você, e eu gosto de pensar em como tudo precisou acontecer exatamente como aconteceu para que, algum dia, os nossos caminhos também se encontrassem.",
    image: "assets/fotos/foto1.jpeg"
  },
  {
    date: "Um olhar sobre você",
    title: "Pelos meus olhos",
    text: "Você carrega dentro de si tantas coisas bonitas que, às vezes, eu queria que pudesse se enxergar através dos meus olhos e perceber o quanto é especial.",
    image: "assets/fotos/foto2.jpeg"
  },
  {
    date: "Mais um capítulo",
    title: "Todas as suas versões",
    text: "Não é apenas sobre comemorar mais um ano da sua vida, mas sobre celebrar cada versão sua que existiu até aqui e que ajudou a construir essa pessoa incrível que você é hoje.",
    image: "assets/fotos/foto3.jpeg"
  },
  {
    date: "Exatamente onde você deve estar",
    title: "O seu lugar no mundo",
    text: "Eu espero que nunca te falte coragem para ser quem você é, porque existe algo único na forma como você ocupa o mundo, algo que simplesmente não poderia ser substituído por ninguém.",
    image: "assets/fotos/foto4.jpeg"
  },
  {
    date: "Para tudo o que ainda vem",
    title: "Um novo ciclo",
    text: "Que este novo ciclo te devolva, em forma de felicidade, um pouco de toda a luz e de todas as coisas bonitas que você espalha, mesmo quando talvez nem perceba.",
    image: "assets/fotos/foto5.jpeg"
  },
  {
    date: "Entre todas as estrelas",
    title: "A sua própria constelação",
    text: "Hoje, entre todas as estrelas do céu, eu escolhi olhar para você, porque nenhuma constelação seria capaz de contar uma história tão bonita quanto a que começou no dia em que você nasceu.",
    image: "assets/fotos/foto6.jpeg"
  },
  {
    date: "Daqui para frente",
    title: "Tudo o que eu desejo para você",
    text: "Eu desejo que os seus próximos dias sejam cheios de momentos que façam você sorrir de verdade e de pessoas que saibam cuidar do seu coração como ele merece.",
    image: "assets/fotos/foto7.jpeg"
  },
  {
    date: "O céu celebra você",
    title: "Hoje é o seu dia",
    text: "E se cada estrela desta constelação representa um pedaço da sua história, então que você nunca se esqueça: hoje o céu inteiro parece um pouco mais bonito porque é o seu dia.",
    image: "assets/fotos/foto8.jpeg"
  },
  {
    date: "Hoje, amanhã e em todos os dias",
    title: "E, por sorte, você existe",
    text: "Entre tantos dias, lugares e possibilidades que existem no mundo, ainda acho bonito demais pensar que você nasceu, cresceu, viveu a sua própria história e, em algum momento, acabou encontrando a minha.",
    image: "assets/fotos/foto9.jpeg"
  }
];

const FINALE_TITLE = "Feliz Aniversário, " + NOME_DELA;
const FINALE_TEXT = "Assim como as estrelas de uma constelação se encontram no imenso universo, cada momento, cada lembrança e cada detalhe seu formam a constelação mais bonita que eu poderia conhecer. Que, entre infinitas estrelas, você nunca esqueça que existe um lugar no meu universo que sempre será seu. Te amo. Feliz aniversário, meu amor. ✨❤️.";

/* ---------- FIM DA PERSONALIZAÇÃO ---------- */

document.getElementById('finaleTitle').textContent = FINALE_TITLE;
document.getElementById('finaleText').textContent = FINALE_TEXT;

/* ---------------------------------------------------------------
   Formato da constelação de Virgem (posições em % da tela)
   Índices seguem a mesma ordem do array MEMORIES acima:
   0 topo · 1 junção superior · 2 braço direito · 3 canto sup. esquerdo
   4 canto inf. esquerdo · 5 cauda 1 · 6 cauda 2 · 7 canto inf. direito
   8 Spica (estrela mais brilhante, base da constelação)
   --------------------------------------------------------------- */
const POSITIONS = [
  {x:73, y:14},  // 0 topo
  {x:65, y:29},  // 1 junção superior
  {x:85, y:27},  // 2 braço direito
  {x:47, y:32},  // 3 canto superior esquerdo
  {x:41, y:50},  // 4 canto inferior esquerdo
  {x:31, y:61},  // 5 cauda 1
  {x:20, y:66},  // 6 cauda 2
  {x:62, y:47},  // 7 canto inferior direito
  {x:57, y:79}   // 8 Spica
];

// Linhas reais da constelação (pares de índices), não é um laço fechado
const LINKS = [
  [0,1],
  [1,2],
  [1,3],
  [3,4],
  [4,5],
  [5,6],
  [1,7],
  [7,4],
  [7,8]
];

const stage = document.getElementById('stage');
const svg = document.getElementById('lines');
let unlocked = 0;

/* estrelas de fundo decorativas */
const sky = document.getElementById('sky');
for(let i=0;i<80;i++){
  const s = document.createElement('div');
  s.className = 'bgstar';
  const size = Math.random()*2 + 1;
  s.style.width = size+'px';
  s.style.height = size+'px';
  s.style.left = Math.random()*100+'%';
  s.style.top = Math.random()*100+'%';
  s.style.animationDelay = (Math.random()*4)+'s';
  sky.appendChild(s);
}

/* cria os traços da constelação (invisíveis até serem desenhados) */
LINKS.forEach((link, i)=>{
  const a = POSITIONS[link[0]], b = POSITIONS[link[1]];
  const line = document.createElementNS('http://www.w3.org/2000/svg','line');
  line.setAttribute('x1', a.x+'%');
  line.setAttribute('y1', a.y+'%');
  line.setAttribute('x2', b.x+'%');
  line.setAttribute('y2', b.y+'%');
  line.setAttribute('class','constellation-line');
  line.setAttribute('id','link-'+i);
  line.setAttribute('pathLength','400');
  svg.appendChild(line);
});

/* estrelas clicáveis */
const starEls = [];
MEMORIES.forEach((mem, i)=>{
  const el = document.createElement('div');
  el.className = 'star-node' + (i===0 ? '' : ' locked');
  el.style.left = POSITIONS[i].x + '%';
  el.style.top = POSITIONS[i].y + '%';
  el.style.animationDelay = (i*0.12)+'s';
  // Spica (última estrela) é a mais brilhante da constelação real
  if(i === MEMORIES.length-1){ el.classList.add('spica'); }
  el.innerHTML = `<div class="core"></div><div class="label">${mem.title}</div>`;
  el.addEventListener('click', ()=> onStarClick(i));
  stage.appendChild(el);
  starEls.push(el);
});

const overlay = document.getElementById('overlay');
const hint = document.getElementById('hint');
const photoEl = document.getElementById('cardPhoto');
const placeholderEl = document.getElementById('photoPlaceholder');

function onStarClick(i){
  if(i !== unlocked) return; // só a próxima da sequência é clicável
  openCard(i);
}

function openCard(i){
  const mem = MEMORIES[i];
  document.getElementById('cardDate').textContent = mem.date;
  document.getElementById('cardTitle').textContent = mem.title;
  document.getElementById('cardText').textContent = mem.text;

  photoEl.style.display = 'none';
  placeholderEl.style.display = 'flex';
  if(mem.image){
    photoEl.onload = ()=>{
      photoEl.style.display = 'block';
      placeholderEl.style.display = 'none';
    };
    photoEl.onerror = ()=>{
      photoEl.style.display = 'none';
      placeholderEl.style.display = 'flex';
    };
    photoEl.src = mem.image;
  }

  overlay.classList.add('show');
  overlay.dataset.current = i;
}

document.getElementById('cardClose').addEventListener('click', ()=>{
  const i = parseInt(overlay.dataset.current);
  overlay.classList.remove('show');
  advance(i);
});

// cria um brilho de raios ao redor da estrela quando ela é revelada
function createStarBurst(x, y){
  const g = document.createElementNS('http://www.w3.org/2000/svg','g');
  g.setAttribute('class','star-burst');
  const rays = 8;
  const innerR = 0.9;  // % - distância do centro onde o raio começa
  const outerR = 2.6;  // % - distância do centro onde o raio termina
  for(let d=0; d<rays; d++){
    const angle = (Math.PI*2/rays) * d;
    const x1 = x + Math.cos(angle)*innerR;
    const y1 = y + Math.sin(angle)*innerR;
    const x2 = x + Math.cos(angle)*outerR;
    const y2 = y + Math.sin(angle)*outerR;
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', x1+'%'); line.setAttribute('y1', y1+'%');
    line.setAttribute('x2', x2+'%'); line.setAttribute('y2', y2+'%');
    line.setAttribute('class','burst-ray');
    line.style.animationDelay = (d*0.04)+'s';
    g.appendChild(line);
  }
  svg.appendChild(g);
}

// desenha qualquer linha cujas DUAS pontas já estejam desbloqueadas
function drawReadyLinks(unlockedSet){
  LINKS.forEach((link, i)=>{
    if(unlockedSet.has(link[0]) && unlockedSet.has(link[1])){
      const lineEl = document.getElementById('link-'+i);
      if(lineEl && !lineEl.classList.contains('drawn')){
        lineEl.classList.add('drawn');
      }
    }
  });
}

const unlockedSet = new Set([0]);

/* som de sino suave ao abrir cada estrela (sintetizado, sem precisar de arquivo) */
function playChime(index){
  try{
    if(!playChime.ctx){
      playChime.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = playChime.ctx;
    // escala ascendente: cada estrela toca uma nota um pouco mais aguda
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5, 1174.66];
    const freq = notes[index % notes.length];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch(e){ /* navegador sem suporte a áudio sintetizado, sem problema */ }
}

/* chuva de confete dourado, usada quando a constelação é completada */
function spawnConfetti(){
  const container = document.createElement('div');
  container.className = 'confetti-container';
  const colors = ['#ffd67e', '#ffe9b8', '#b8a4ff', '#ffffff'];
  const count = 70;
  for(let i=0; i<count; i++){
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = (Math.random()*100) + '%';
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDelay = (Math.random()*0.7) + 's';
    piece.style.animationDuration = (2.4 + Math.random()*1.6) + 's';
    const size = 5 + Math.random()*7;
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.setProperty('--drift', (Math.random()*180 - 90) + 'px');
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  setTimeout(()=>{ container.remove(); }, 4200);
}

function advance(i){
  starEls[i].classList.remove('locked');
  starEls[i].classList.add('done');
  createStarBurst(POSITIONS[i].x, POSITIONS[i].y);
  playChime(i);
  unlockedSet.add(i);
  drawReadyLinks(unlockedSet);
  unlocked = i+1;

  if(unlocked < MEMORIES.length){
    starEls[unlocked].classList.remove('locked');
    hint.textContent = `estrela ${unlocked+1} de ${MEMORIES.length} — continue a jornada`;
  } else {
    hint.textContent = 'sua constelação está completa ✨';
    spawnConfetti();
    setTimeout(()=>{
      document.getElementById('finale').classList.add('show');
      spawnConfetti();
    }, 1400);
  }
}

/* ---------- mensagem de voz na tela final ---------- */
const voiceMsg = document.getElementById('voiceMsg');
const voiceMsgBtn = document.getElementById('voiceMsgBtn');
if(voiceMsg && voiceMsgBtn){
  const voiceTxt = voiceMsgBtn.querySelector('.voice-txt');
  voiceMsgBtn.addEventListener('click', ()=>{
    if(voiceMsg.paused){
      voiceMsg.play().catch(()=>{
        voiceTxt.textContent = 'áudio não encontrado';
      });
    } else {
      voiceMsg.pause();
    }
  });
  voiceMsg.addEventListener('play', ()=>{
    voiceMsgBtn.classList.add('playing');
    voiceTxt.textContent = 'tocando a mensagem...';
    if(music && !music.paused){ music.pause(); }
  });
  voiceMsg.addEventListener('pause', ()=>{
    voiceMsgBtn.classList.remove('playing');
    voiceTxt.textContent = 'ouvir uma mensagem minha';
  });
  voiceMsg.addEventListener('ended', ()=>{
    voiceMsgBtn.classList.remove('playing');
    voiceTxt.textContent = 'ouvir de novo';
  });
}

document.getElementById('finaleClose').addEventListener('click', ()=>{
  location.reload();
});

/* ---------- música ambiente ---------- */
const music = document.getElementById('bgMusic');

/* ---------- voltar para a tela do buraco negro ---------- */
const backToVoidBtn = document.getElementById('backToVoidBtn');
if(backToVoidBtn){
  backToVoidBtn.addEventListener('click', ()=>{
    if(music && !music.paused){ music.pause(); }
    if(typeof window.showBlackHoleIntro === 'function'){
      window.showBlackHoleIntro();
    }
  });
}
