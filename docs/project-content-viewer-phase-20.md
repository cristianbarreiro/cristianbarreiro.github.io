---
type: report
title: Description Slide — Project Content Viewer, Fase 20
description: Implementación y QA aislado de la descripción HTML sobre una composición SVG reutilizable.
tags:
  - projects
  - viewer
  - description-slide
  - qa
generated:
  by: codex
  at: "2026-10-03"
status: implemented
---

# Fase 20 — Description Slide

## Objetivo

Añadir el tipo `description` a la secuencia aislada de `ProjectContentViewer`, sin conectar el nuevo viewer al flujo de producción de `ProjectDetailModal`.

## Componente y modelo visual

`ProjectDescriptionSlide.jsx` es responsable de la slide `description`. Compone un SVG genérico, decorativo y generado en React (retícula, trazos, marco, círculos y luces con tokens de acento) con contenido HTML/Mantine superpuesto. El SVG tiene `aria-hidden="true"` y `focusable="false"`; sus IDs se generan de forma única. No usa `descriptionVisual`, no rasteriza texto ni depende de las composiciones específicas de proyecto.

El layout adapta el mismo diseño a desktop y móvil. El contenido largo permanece en una zona desplazable, se ajustan tamaños con `clamp`, y los grupos de tags y acciones pueden envolver. La slide no monta el viewer multimedia mientras está activa; por tanto, no renderiza imágenes ni vídeos de media para presentar Description.

## Datos y acciones

La slide utiliza directamente propiedades existentes:

- `title`, `featured`, `date`.
- `longDescription || description`; si ambos faltan, no inventa ni muestra texto de sustitución.
- `tags` como badges.
- `demoUrl`, `backofficeUrl`, `downloads` y `repoUrl` para acciones reales.

El botón existente `projectCard.viewImagesAndVideos` aparece sólo cuando la secuencia contiene media y selecciona el primer medio dentro de `ProjectContentViewer`. Al volver desde media, el botón “Ver descripción” del visor existente regresa a esta slide. No se crea otro Modal.

## i18n y accesibilidad

Se reutilizan traducciones existentes para featured, demo/e-commerce, backoffice, install, media, GitHub/código y cerrar. No se agregaron claves nuevas. Se mantienen links y botones reales, etiquetas accesibles en el botón de cierre, el título como `h1`, texto seleccionable y fechas/tags como contenido DOM. El dibujo SVG no participa en el árbol accesible.

## Integración

`ProjectContentViewer` acepta `description`, `image` y `video`. Al abrir la secuencia comienza en `initialSlide` (por defecto 0); para la secuencia de QA, Description es el primer elemento. Desde Description, CTA y flecha derecha llevan al primer medio. El modo de media sigue delegado en `ProjectImagesViewer`, con su navegación, zoom, video, teclado, Escape, thumbnails y regreso a Description.

El componente aún **no está integrado** con `ProjectDetailModal`. El flujo de detalle actual conserva intacta su presentación. La galería directa continúa con el wrapper legacy. No se modificaron `ProjectCard.jsx`, `ProjectDetailModal.jsx`, `ProjectDescriptionVisual.jsx`, `projects.js` ni `src/data/projectVisuals/`.

## QA

Se usó un harness de desarrollo temporal separado de las rutas del portfolio y se eliminó al finalizar. Se generaron capturas de Chrome con dimensiones de salida 1280×800 y 390×844. El motor headless reportó una ventana CSS de 500 px para la captura móvil; el contenedor del harness se limitó a 390 px y se mantuvo activo el breakpoint móvil (<768 px). Esto permitió verificar el layout a 390 px de contenido sin modificar breakpoints del producto.

Casos visuales revisados:

- CDEV Studios: descripción larga, muchos tags y repositorio, en español e inglés.
- Sistema de Control de Versiones: texto más corto, pocos tags, sin medios; la acción de media queda oculta.
- Perfumería Cataleya: tags numerosos, demo y backoffice.
- PrivGvard: destacado, descargas/Install y repositorio.
- Socratica: transición desde Description a imagen y al vídeo con el CTA y la navegación del viewer existente.
- CDEV Studios a 390 px: wrapping y scroll vertical del texto/tags sin desbordamiento horizontal; captura al inicio y al final del contenido para confirmar acceso a las acciones.

La regresión del flujo visible se comprobó por revisión del diff: `ProjectCard.jsx`, `ProjectDetailModal.jsx` y los wrappers legacy no cambiaron; la galería directa sigue llamando al mismo `ProjectImagesModal`/`ProjectImagesViewer`. El nuevo viewer reutiliza ese motor para media.

## Validaciones

- `npm run lint`: PASS.
- Paridad i18n ES/EN: PASS; no se añadieron claves.
- `npm run build`: PASS; permanece el aviso existente de chunks mayores de 500 kB.
- `git diff --check`: PASS.

## Limitaciones

- `visual` no se implementa todavía.
- `ProjectDetailModal` no se conecta al nuevo viewer.
- Los thumbnails y la navegación global sobre una secuencia mixta Description/Visual/Media quedan para una fase posterior.
- Las comprobaciones de cierre/Escape y el regreso al detalle actual no se alteraron; su prueba funcional real queda para la integración del nuevo viewer.

## Resultado

```text
Description Slide: IMPLEMENTADA
ProjectContentViewer: description + image + video
ProjectDetailModal: SIN CAMBIOS / NO INTEGRADO
Visual Slide: NO IMPLEMENTADA EN ESTA FASE
ProjectCard y galería directa: SIN CAMBIOS
```
