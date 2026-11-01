(() => {
  const WHATSAPP = '56956713663';
  const contenido = document.getElementById('contenido');
  document.getElementById('anio').textContent = new Date().getFullYear();

  const formatear = (n) => '$' + Number(n).toLocaleString('es-CL');
  const precioTexto = (p) => (p.precioMax && p.precioMax !== p.precio)
    ? 'Desde ' + formatear(p.precio)
    : formatear(p.precio);

  const el = (tag, clase, texto) => {
    const n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto !== undefined) n.textContent = texto;
    return n;
  };

  const mostrarError = (mensaje) => {
    contenido.replaceChildren(el('p', 'vacio', mensaje));
  };

  const galeria = (p) => {
    const wrap = el('div', 'galeria');
    const principal = el('div', 'foto-principal');
    const grande = el('img');
    grande.alt = p.nombre;
    grande.src = p.imagenes[0];
    principal.appendChild(grande);

    const miniaturas = el('div', 'miniaturas');
    p.imagenes.forEach((src, i) => {
      const b = el('button', i === 0 ? 'activa' : '');
      b.type = 'button';
      b.setAttribute('aria-label', `Foto ${i + 1} de ${p.imagenes.length}`);
      const img = el('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      b.appendChild(img);
      b.addEventListener('click', () => {
        grande.src = src;
        miniaturas.querySelectorAll('button').forEach((x) => x.classList.remove('activa'));
        b.classList.add('activa');
      });
      miniaturas.appendChild(b);
    });

    wrap.append(principal, miniaturas);
    return wrap;
  };

  const info = (p) => {
    const div = el('div', 'info');
    div.append(
      el('p', 'categoria', p.categoria),
      el('h1', '', p.nombre),
      el('p', 'precio', precioTexto(p))
    );

    if (p.opciones && p.opciones.length) {
      p.opciones.forEach((o) => {
        const bloque = el('div', 'opcion');
        bloque.append(el('h3', '', o.nombre));
        const lista = el('div', 'valores');
        o.valores.forEach((v) => lista.appendChild(el('span', 'valor', v)));
        bloque.appendChild(lista);
        div.appendChild(bloque);
      });
    }

    if (p.descripcion) {
      div.appendChild(el('p', 'descripcion', p.descripcion));
    }

    const compra = el('div', 'compra');
    const deshabilitado = el('button', 'boton-deshabilitado', 'Comprar');
    deshabilitado.type = 'button';
    deshabilitado.disabled = true;
    deshabilitado.setAttribute('aria-describedby', 'aviso-compra');
    compra.appendChild(deshabilitado);
    compra.appendChild(el('p', 'aviso', 'La compra en línea estará disponible con la nueva temporada.'));
    const consulta = el('a', 'boton-secundario', 'Consultar por WhatsApp');
    consulta.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Boa Ideia, me interesa ' + p.nombre)}`;
    consulta.target = '_blank';
    consulta.rel = 'noopener';
    compra.appendChild(consulta);
    div.appendChild(compra);

    return div;
  };

  const cargar = async () => {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) return mostrarError('Producto no encontrado.');

    const productos = await fetch('data/productos.json').then((r) => r.json());
    const p = productos.find((x) => x.id === id);
    if (!p) return mostrarError('Producto no encontrado.');

    document.title = `${p.nombre} · Boa Ideia`;
    document.querySelector('meta[name="description"]').content = p.descripcion || `${p.nombre} · Boa Ideia`;
    document.getElementById('migas-categoria').textContent = `› ${p.categoria} › ${p.nombre}`;

    const layout = el('div', 'producto-grid');
    layout.append(galeria(p), info(p));
    contenido.replaceChildren(layout);
  };

  cargar().catch(() => mostrarError('No pudimos cargar el producto. Intenta más tarde.'));
})();
