---
type: report
title: Implementación base del Project Content Viewer — Fase 19
description: Registro de la frontera reutilizable de slides image/video y su compatibilidad con el visor legacy.
tags:
  - projects
  - viewer
  - implementation
  - qa
generated:
  by: codex
  at: "2026-10-03"
status: implemented
---

# Fase 19 — Project Content Viewer Base

## Objetivo

Crear la infraestructura de `ProjectContentViewer` para slides multimedia sin sustituir ni integrar todavía el flujo de detalle. Se mantiene como referencia la arquitectura documentada en [Fase 18](project-content-viewer-architecture.md).

## Arquitectura

`ProjectContentViewer` acepta `slides`, `initialSlide`, `onClose` y `projectTitle`. Filtra los tipos soportados (`image`, `video`), normaliza `src`, `alt`, `caption` y `type`, limita el índice inicial al rango válido y delega el render al `ProjectImagesViewer` existente.

Esta frontera permite introducir renderers para otros tipos posteriormente; en esta fase el modelo sólo acepta media. El chrome y la interacción no se copiaron: el componente reutiliza el mismo motor y CSS de producción, evitando que los dos viewers diverjan visualmente. `ProjectImagesViewer` admite un `initialIndex` opcional, con valor por defecto `0`, por lo que las rutas legacy conservan su inicialización.

## Slides soportadas

- `image`: render de imagen, alt/caption, navegación, contador, thumbnail, zoom y paneo existentes.
- `video`: reproducción con controles nativos, navegación, contador y representación thumbnail existentes; no recibe zoom de imagen.

Los elementos de otros tipos no se renderizan aún. Si el array queda vacío después de filtrar, `ProjectContentViewer` no renderiza contenido.

## Compatibilidad

- `ProjectImagesViewer` continúa siendo operativo y conserva sus handlers, markup, clases y estilos. El único cambio es el prop opcional `initialIndex`.
- `ProjectImagesModal` mantiene su API y continúa montando el viewer legacy.
- `ProjectCard.jsx` no fue modificado. La galería directa conserva el camino `ProjectCard → ProjectImagesModal → ProjectImagesViewer`.
- `ProjectDetailModal.jsx` no fue modificado ni integrado con el nuevo viewer.
- No se añadieron dependencias ni cambios a los datos visuales o al renderer SVG.

## Regresiones y validación

Se revisó el diff para confirmar que `ProjectCard.jsx`, `ProjectImagesModal.jsx`, `ProjectDetailModal.jsx`, `ProjectDescriptionVisual.jsx`, los datos de proyectos y las composiciones SVG no cambiaron. La ruta directa conserva los mismos componentes, estado inicial, handlers, markup y estilos; el nuevo viewer delega en ese motor, así que no hay una implementación visual alternativa que pueda divergir.

No existe infraestructura de pruebas automatizadas en el proyecto. Como el nuevo componente no se conecta a una ruta ni a un Modal durante esta fase, no se añadieron rutas/harness de QA temporales ni se hizo una comparación manual en navegador del componente aislado. La interacción legacy sigue siendo la implementación visible para la aplicación. La inspección funcional manual del nuevo viewer en 1280×800 y 390×844 queda pendiente para la fase de integración, antes de que sea expuesto a usuarios.

- `npm run lint`: PASS.
- `npm run build`: PASS. Vite informa que algunos chunks superan 500 kB; es una advertencia y no impidió la compilación.
- `git diff --check`: PASS.
- Revisión final: sólo los dos componentes del viewer nuevo/compartido y los dos documentos de arquitectura de Fase 19 están modificados; `ProjectCard.jsx` permanece intacto.

## Limitaciones

Quedan deliberadamente para fases posteriores:

- `description` slide.
- `visual` slide y SVG demostrativo dentro del viewer.
- Integración con `ProjectDetailModal`.
- Navegación por un índice mixto Description/Visual/Media y thumbnails tipados para todos esos contenidos.
- Comparación manual del viewer nuevo visible dentro de su shell final.

## Resultado

```text
ProjectContentViewer base: IMPLEMENTADO
Existing media behavior: PRESERVADO
Direct Gallery: PRESERVADA
Description Slide: NO IMPLEMENTADA EN ESTA FASE
Visual Slide: NO IMPLEMENTADA EN ESTA FASE
```
