/* ============================================================
   BOTÃO DE MÚSICA — ícone único, clique liga/desliga
   Passe o mouse por cima para ver qual música é e se está
   tocando ou pausada.
   ============================================================ */

(function(){
  function wire(btnId, audio, volume, trackLabel){
    const btn = document.getElementById(btnId);
    if(!btn || !audio) return;

    function updateTitle(){
      const status = audio.paused ? 'Tocar' : 'Pausar';
      btn.title = `${status} — ${trackLabel}`;
      btn.setAttribute('aria-label', `${status} ${trackLabel}`);
    }

    btn.addEventListener('click', ()=>{
      if(audio.paused){
        audio.volume = volume;
        audio.play().catch(()=>{});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', ()=>{ btn.classList.add('playing'); updateTitle(); });
    audio.addEventListener('pause', ()=>{ btn.classList.remove('playing'); updateTitle(); });

    updateTitle();
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    // Troque os nomes abaixo se quiser mudar o texto que aparece na dica
    wire('introMusicToggle', document.getElementById('introMusic'), 0.5, 'Interstellar (trilha da introdução)');
    wire('musicToggle', document.getElementById('bgMusic'), 0.35, 'Nossa trilha (música ambiente)');
  });
})();
