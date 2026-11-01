(() => {
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cabecera = document.querySelector('.cabecera');
  if (cabecera) {
    const actualizar = () => cabecera.classList.toggle('compacta', window.scrollY > 40);
    window.addEventListener('scroll', actualizar, { passive: true });
    actualizar();
  }

  const selectores = '.filosofia h2, .filosofia p, .catalogo h2, .filtros, .dos-columnas > *, .puntos h2, .puntos .intro, .columnas-puntos > div, .pie > div';
  document.querySelectorAll(selectores).forEach((el) => el.classList.add('reveal'));

  if (reducido || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    return;
  }

  const observar = (el, delay = 0) => {
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    obs.observe(el);
  };
  document.querySelectorAll('.reveal').forEach((el) => observar(el));

  // Las tarjetas se generan con JS: revelarlas escalonadas al aparecer.
  const grilla = document.getElementById('grilla');
  if (grilla) {
    const vistas = new MutationObserver(() => {
      [...grilla.children].forEach((t, i) => {
        if (t.classList.contains('reveal')) return;
        t.classList.add('reveal');
        observar(t, Math.min(i, 8) * 60);
      });
    });
    vistas.observe(grilla, { childList: true });
  }
})();
