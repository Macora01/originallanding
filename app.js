(() => {
  const WHATSAPP = '56956713663';
  const grilla = document.getElementById('grilla');
  const filtros = document.getElementById('filtros');
  const vacio = document.getElementById('vacio');
  document.getElementById('anio').textContent = new Date().getFullYear();

  const formatear = (n) => '$' + Number(n).toLocaleString('es-CL');

  const precioTexto = (p) => {
    if (p.precioMax && p.precioMax !== p.precio) return 'Desde ' + formatear(p.precio);
    return formatear(p.precio);
  };

  const consultaUrl = (p) => {
    const texto = `Hola Boa Ideia, me interesa ${p.nombre}`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  };

  const tarjeta = (p) => {
    const art = document.createElement('article');
    art.className = 'tarjeta';

    const foto = document.createElement('div');
    foto.className = 'foto';
    p.imagenes.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = i === 0 ? p.nombre : '';
      img.loading = 'lazy';
      foto.appendChild(img);
    });

    const nombre = document.createElement('h3');
    nombre.textContent = p.nombre;

    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.textContent = precioTexto(p);

    const consulta = document.createElement('a');
    consulta.className = 'consulta';
    consulta.href = consultaUrl(p);
    consulta.target = '_blank';
    consulta.rel = 'noopener';
    consulta.textContent = 'Consultar por WhatsApp';

    art.append(foto, nombre, precio, consulta);
    return art;
  };

  const pintar = (lista) => {
    grilla.replaceChildren(...lista.map(tarjeta));
    vacio.hidden = lista.length > 0;
  };

  const cargar = async () => {
    const res = await fetch('data/productos.json');
    const productos = await res.json();
    const conImagen = productos.filter((p) => p.imagenes.length > 0);

    const categorias = [...new Set(conImagen.map((p) => p.categoria))].sort();
    const botones = ['Todos', ...categorias].map((nombre) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = nombre;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', nombre === 'Todos' ? 'true' : 'false');
      b.addEventListener('click', () => {
        botones.forEach((x) => x.setAttribute('aria-selected', 'false'));
        b.setAttribute('aria-selected', 'true');
        pintar(nombre === 'Todos' ? conImagen : conImagen.filter((p) => p.categoria === nombre));
      });
      return b;
    });
    filtros.replaceChildren(...botones);

    const heroes = conImagen.slice(0, 2).map((p) => p.imagenes[0]);
    heroes.forEach((src, i) => {
      const el = document.getElementById(`hero-img-${i + 1}`);
      if (el) el.style.backgroundImage = `url("${src}")`;
    });

    pintar(conImagen);
  };

  cargar().catch(() => {
    vacio.textContent = 'No pudimos cargar los productos. Escríbenos por WhatsApp.';
    vacio.hidden = false;
  });
})();
