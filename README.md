# Boa Ideia · Landing

Sitio estático de Boa Ideia (ropa de mujer importada desde Europa). HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Estructura

- `index.html`: contenido y secciones.
- `styles.css`: estilos (colores y tipografías de la tienda original).
- `app.js`: carga el catálogo desde `data/productos.json`.
- `data/productos.json`: productos activos (nombre, categoría, precio en CLP e imágenes).
- `assets/img/`: logo y fotos de producto optimizadas.

## Ejecutar en local

Abre `index.html` en el navegador, o sirve la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8080
```

## Despliegue

Coolify sirve la carpeta como sitio estático en `boa.facore.cl`.
