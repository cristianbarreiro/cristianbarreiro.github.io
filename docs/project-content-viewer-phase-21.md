---
type: report
title: Project Visual Slide — Project Content Viewer, Fase 21
description: Integración aislada de las visuales de proyecto existentes como diapositivas navegables.
tags:
  - projects
  - viewer
  - visual-slide
  - qa
generated:
  by: codex
  at: "2026-10-03"
status: implemented
---

# Fase 21 — Project Visual Slide

## Objetivo

Añadir `visual` a la secuencia de `ProjectContentViewer` y conservar aislada esta experiencia. `ProjectDetailModal integration: pendiente`.

## Implementación

`ProjectVisualSlide.jsx` es una capa adaptadora: entrega `project` y `project.descriptionVisual` al único renderer, `ProjectDescriptionVisual`. No copia composiciones ni genera assets rasterizados. El renderer, `projects.js` y las definiciones de `src/data/projectVisuals/` permanecen intactos.

El viewer acepta `description`, `visual`, `image` y `video`. La navegación conserva un índice y contador globales. Description y Visual se pueden seleccionar desde miniaturas accesibles; cuando hay varios medios, sus miniaturas existentes siguen mostrando las imágenes/vídeos. La Visual permite avanzar al primer medio y volver a Description mediante navegación global. En medios, flechas, teclado, swipe y miniaturas participan en la secuencia completa; Escape y zoom conservan el comportamiento multimedia existente.

Se añadieron callbacks opcionales a `ProjectImagesViewer` para navegación/contador global y miniaturas de contenido. `ProjectImagesModal` no los usa, por lo que la galería directa conserva el contrato y navegación propios de medios.

## Datos y fallback

La secuencia usa el objeto `project` existente; no se añade `descriptionSlide`, `visualSlide` ni se cambia el modelo de datos. Se verificaron 19 definiciones visuales y 38 asignaciones en `projects.js` (19 por idioma): cobertura 19/19 en español e inglés.

Si una definición no está presente, el viewer omite la slide Visual y evita mostrar un SVG vacío; Description puede llevar al primer medio si existe. El fallback `DEFAULT_DESCRIPTION_VISUAL` del modal de producción permanece intacto y fuera del viewer aislado. No se duplicó ni movió esa definición.

Se agregaron claves bilingües para el CTA a Visual, nombres de miniaturas y controles de diapositiva.

## Secuencia

```text
Description → Visual → Image / Video
```

El CTA de Description abre Visual. Los thumbnails, flechas y teclado cambian el índice compartido. Visual → Media abre el primer medio real; media sigue usando controles y motor existentes. Se admiten secuencias sin media, con imagen, con vídeo y con ambos.

## QA visual y de navegación

Se usó un harness temporal con Chrome headless, eliminado al terminar. Capturas comprobadas en 1280×800 y 390×844, en ES y EN.

- CDEV Studios: composición compleja y contenido largo; Description/Visual, miniaturas, contador, desktop y móvil.
- MCP Secure Delete: Visual sin medios; secuencia `02 / 02`, sin CTA inventado.
- Socratica: secuencia con imagen y vídeo; `03 / 04` en imagen, avance a `04 / 04` en vídeo y selección de Visual desde miniaturas.
- Transiciones comprobadas: Description → Visual → Media; Visual → Description → Visual por teclado; Media → Visual por miniatura.
- Confirmado que el SVG se mantiene dentro de 390 px y que el contador corresponde al índice global.

La regresión de la galería directa se revisó por contrato/diff: `ProjectCard.jsx`, `ProjectImagesModal.jsx` y sus props no cambiaron. Los callbacks nuevos son opcionales y sólo los proporciona `ProjectContentViewer`.

## Archivos modificados

- `src/components/ProjectContentViewer.jsx`
- `src/components/ProjectContentViewer.css`
- `src/components/ProjectVisualSlide.jsx` (nuevo)
- `src/components/ProjectImagesViewer.jsx` (callbacks opcionales de navegación global)
- `public/locales/es.json`
- `public/locales/en.json`
- `docs/project-content-viewer-architecture.md`
- `docs/project-content-viewer-phase-21.md` (este informe)

No se modificaron `ProjectDetailModal.jsx`, `ProjectCard.jsx`, `ProjectImagesModal.jsx`, `ProjectDescriptionVisual.jsx`, `projects.js` ni `src/data/projectVisuals/`.

## Validaciones

- `npm run lint`: PASS.
- Paridad i18n ES/EN: PASS.
- `npm run build`: PASS; se mantiene el aviso conocido de chunks superiores a 500 kB.
- `git diff --check`: PASS.

## Limitaciones

- La integración con `ProjectDetailModal` sigue pendiente.
- La galería directa se confirmó por revisión del contrato y el diff; la QA visual de esta fase usó el viewer aislado.
- No se modificó ninguna composición que pueda requerir ajustes individuales; una composición existente puede contener etiquetas pequeñas debido a su propio `viewBox`.

## Resultado

```text
ProjectVisualSlide: IMPLEMENTADA
Cobertura visual de proyectos: 19 / 19 (ES y EN)
ProjectContentViewer: description + visual + image + video
ProjectDetailModal integration: PENDIENTE
ProjectCard y galería directa: SIN CAMBIOS DE CONTRATO
```
