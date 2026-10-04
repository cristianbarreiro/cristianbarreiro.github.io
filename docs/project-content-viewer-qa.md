# Project Content Viewer — QA Delta

## Fase 26 — Visor de detalle replicado

- **Manual:** Description ↔ Visual, contador, flechas/teclado, CTA a Media, retorno a Description y cierre con Escape comprobados en 1280×800 y 390×844.
- **Manual:** Galería directa de PrivGvard comprobada sin cambios; mantiene imagen, zoom, thumbnails, navegación y botón de cierre.
- **Accesibilidad:** El foco vuelve a la tarjeta que abrió el detalle.
- **Automático:** `npm run lint` — correcto; paridad i18n ES/EN — correcta (310 claves); `npm run build` — correcto.
- **Nota:** Vite informa chunks superiores a 500 kB (incluye TechGlobe y el bundle principal); optimización de bundle fuera del alcance de esta fase.

## Fase 27 — Fondo degradado de Description

- **Manual:** Description revisada a 1280×800 y 390×844; el glow ocupa el canvas completo sin overflow. La vista Visual mantiene el tamaño anterior del glow y el contenido SVG es idéntico.
- **Manual:** Flechas Description ↔ Visual y CTA al visor multimedia comprobados; el visor conserva contador, controles de zoom, navegación y thumbnails.
- **Automático:** `npm run lint` y `npm run build` — correctos.
- **Nota:** Vite mantiene avisos de chunks superiores a 500 kB.
