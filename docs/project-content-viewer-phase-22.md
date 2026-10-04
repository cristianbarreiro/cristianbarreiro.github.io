---
type: implementation-record
title: Integración de ProjectContentViewer — Fase 22
description: Integración de descripción, visual y medios en una secuencia dentro de ProjectDetailModal.
tags:
  - projects
  - viewer
  - modal
  - phase-22
generated:
  by: codex
  at: "2026-10-04"
status: implemented
---

# Integración de ProjectContentViewer — Fase 22

## Objetivo

Integrar `ProjectContentViewer` en `ProjectDetailModal` para recorrer la descripción, el visual del proyecto y sus imágenes o vídeos dentro de un solo modal.

## Arquitectura

Antes, `ProjectDetailModal` seleccionaba por separado la vista de descripción y el visor multimedia. Ahora el árbol es:

```text
ProjectDetailModal
└── Modal de Mantine
    └── ProjectContentViewer
        ├── Description
        ├── Visual SVG
        └── Images / Videos
```

El modal de Mantine conserva el título, el botón nativo de cierre y el manejo de foco. `ProjectContentViewer` administra el índice activo de la secuencia.

## Construcción y estado de slides

`ProjectDetailModal` normaliza los medios existentes del proyecto y construye la secuencia en este orden:

1. `description`, con el objeto de proyecto localizado actual.
2. `visual`, con `project.descriptionVisual` o el fallback ya existente.
3. Cada imagen o vídeo disponible.

El viewer recibe `initialSlide={0}`. Su sesión se reinicia al cerrar o cuando cambia el objeto de proyecto, incluido un cambio de idioma que entregue un proyecto localizado nuevo.

Los proyectos sin medios conservan Description y Visual. No reciben un botón de medios ni slides multimedia vacías.

## Salto directo a medios

El botón **Ver imágenes y vídeos** de Description cambia el índice a la primera slide de medios. El botón no existe si el proyecto no tiene medios. Las flechas y los thumbnails del viewer permiten recorrer la secuencia global.

## Acciones conservadas

La slide Description continúa mostrando los enlaces disponibles de Demo / Proyecto online, Backoffice, Downloads / Install y GitHub, con sus URLs y claves de traducción existentes.

## Media y responsabilidades del modal

El visor multimedia conserva navegación, vídeo, zoom, thumbnails, gestos táctiles, caption, manejo de errores y su Escape contextual. En el modal integrado, título y cierre corresponden al shell nativo de Mantine; por eso `ProjectContentViewer` y `ProjectImagesViewer` aceptan props opcionales para ocultar sus títulos y botones de cierre internos. Sus valores por defecto mantienen el flujo independiente de galería.

`ProjectCard.jsx` no fue modificado. `ProjectImagesModal.jsx` tampoco. La galería directa conserva las props por defecto de `ProjectImagesViewer`, incluyendo título y cierre propios.

## Accesibilidad

- El botón nativo de cierre mantiene `underConstruction.close` como etiqueta accesible.
- Mantine conserva su trampa de foco y retorno al disparador.
- Description y Visual manejan Escape para cerrar.
- En Media, el Escape existente reinicia primero el zoom cuando supera 100%; en escala normal cierra el modal.
- Los controles de navegación y thumbnails mantienen sus etiquetas traducidas.

El modal desactiva su cierre automático con Escape para evitar competir con el manejador contextual del viewer. El cierre exterior sigue activo.

## Internacionalización y datos

La integración utiliza las traducciones existentes. No se modificaron proyectos, visuales ni archivos de locales. El catálogo conserva las 19 configuraciones visuales bilingües (38 referencias en el archivo de datos).

## QA realizado

- `npm run lint`: correcto.
- Paridad i18n: correcta, 314 claves.
- `npm run build`: correcto. Vite generó el bundle y emitió el aviso de chunks mayores a 500 kB (`TechGlobe` y bundle principal).
- `git diff --check`: correcto.
- Chrome, escritorio 1280 × 800: CDEV Studios mostró Description `01/05`, Visual `02/05` y el salto a la primera imagen `03/05`; Socratica mostró el vídeo como `04/04`.
- Chrome, móvil: las capturas de Description de MCP Secure Delete y Media de Socratica confirmaron que se activa el breakpoint móvil y mantienen las slides esperadas. Chrome headless de este entorno impuso un viewport CSS mínimo superior al tamaño físico de captura solicitado; por eso el ajuste exacto a 390 × 844 en una ventana interactiva queda pendiente.
- La secuencia para vídeo se avanzó con una pulsación sintética de ArrowRight. El control interactivo completo de Tab, Shift+Tab, Enter, Space, cierre y retorno real del foco no pudo completarse con la automatización de ventanas disponible; su comportamiento se revisó en el código y Mantine mantiene el shell nativo.
- No se abrió manualmente la galería directa en el navegador durante esta QA. Se verificó que `ProjectCard.jsx` permanece intacto, que `ProjectImagesModal.jsx` no cambia y que las props nuevas del visor conservan `true` por defecto.
- No se probó una carga fallida de medio ni el fallback SVG mediante un proyecto alterado; ambos caminos permanecen conectados a sus manejadores actuales y el fallback se pasa desde `ProjectDetailModal`.

## Archivos de implementación

- `src/components/ProjectDetailModal.jsx`
- `src/components/ProjectContentViewer.jsx`
- `src/components/ProjectDescriptionSlide.jsx`
- `src/components/ProjectVisualSlide.jsx`
- `src/components/ProjectImagesViewer.jsx`
- `src/components/ProjectContentViewer.css`
- `src/components/ProjectImagesModal.css`

No se modificaron `ProjectCard.jsx`, `ProjectImagesModal.jsx`, `ProjectDescriptionVisual.jsx`, `Projects.jsx`, `FeaturedProjects.jsx`, los datos, las traducciones, el routing ni las dependencias.
