---
type: architecture
title: Arquitectura del Project Content Viewer
description: Auditoría del flujo actual de detalle y galería de proyectos y diseño incremental para un viewer de slides reutilizable.
tags:
  - projects
  - viewer
  - architecture
  - accessibility
generated:
  by: codex
  at: "2026-10-03"
status: proposed
---

# Fase 18 — Arquitectura del Project Content Viewer

## Alcance y decisión

Este documento audita el código actual y propone una migración incremental. **No implementa el nuevo viewer ni cambia el comportamiento existente.** El objetivo es reunir Description, el visual SVG y los medios del proyecto en una secuencia, sin acoplar a esa experiencia la galería que se abre directamente desde una card.

> `ProjectCard.jsx NO forma parte de esta migración. La galería directa debe conservar su comportamiento actual.`

## 1. Estado actual

### Flujo de detalle

`ProjectDetailModal` es el propietario del único `Modal` del detalle. Mantiene `{ project, view }`, con `description` como vista inicial y `media` al pulsar “Ver imágenes y vídeos”. Si la prop `project` cambia, la vista derivada vuelve a `description`; `handleClose` también restablece ese estado antes de llamar a `onClose`. Description y Media se renderizan condicionalmente dentro del mismo Modal: al cambiar de vista se desmonta una y se monta la otra.

Description construye una lista de medios a partir de `project.images` y, cuando el array está vacío, usa `project.image` como alternativa. Normaliza strings y objetos (`src`, `url` o `image`, `alt`, `caption`, `type`). El botón de medios sólo aparece cuando el resultado no está vacío. También muestra featured, título, fecha, descripción larga o corta, el SVG (`project.descriptionVisual` o un fallback local), tags y enlaces de demo, backoffice, descargas y repositorio.

Al pasar a Media, `ProjectDetailModal` entrega la lista normalizada a `ProjectImagesViewer` con `opened`, título y callbacks. Desactiva el cierre por Escape del Modal durante Media, pues el viewer instala un listener de teclado: Escape con zoom superior a 1 restablece zoom y desplazamiento; Escape sin zoom cierra. En Description el cierre por Escape lo gestiona Mantine. Mantine conserva el ciclo habitual del Modal (trampa y retorno de foco); no hay gestión manual de foco en estos componentes. El cierre también puede ocurrir por el botón interno, el botón de cierre de Mantine en Description y el cierre externo admitido por el Modal. En Media el clic fuera sigue permitido por el Modal.

### Visor multimedia y wrapper

`ProjectImagesViewer` es el motor de presentación actual, usado por ambos flujos. Mantiene el índice activo, zoom, paneo, errores de medio/thumbnail y visibilidad de thumbnails. Implementa precarga de vecinos, rotación circular de anterior/siguiente, controles de zoom, zoom con rueda/clic, drag para paneo, swipe y pinch táctil, atajos de teclado, animación de transición, fallback de error, reproducción de vídeo y caption. El contador, las flechas y la tira de thumbnails se muestran cuando hay más de un medio; el botón para ocultar/mostrar thumbnails está en la barra. El thumbnail de vídeo usa un preview y un indicador de reproducción.

`ProjectImagesModal` aporta el Modal independiente de la galería: tamaño responsive, fondo, overlay y estilos. No mantiene el índice ni duplica la lógica del viewer. `ProjectDetailModal` aporta otro Modal con configuración visual distinta y reutiliza directamente el mismo `ProjectImagesViewer`; añade el botón “Ver descripción” mediante `onBackToDescription`.

### Galería directa de las cards

`ProjectCard` normaliza los mismos campos de imagen y monta `ProjectImagesModal` cuando se activa el control de galería. El flujo es independiente de la selección que abre el detalle y permanece así en las variantes `default`, `carousel` y `list` donde está habilitada la galería. La migración propuesta debe preservar las props existentes de `ProjectImagesModal` (`opened`, `onClose`, `images`, `projectTitle`) para no requerir cambios en `ProjectCard.jsx`.

### SVG y datos

`ProjectDescriptionVisual` es un renderer declarativo de SVG que recibe `project` y `visualData`; asigna identificadores únicos a gradientes y expone título y descripción accesibles. `src/data/projectVisuals/index.js` exporta las composiciones por módulo. `projects.js` importa esas composiciones estáticamente y las asigna a los proyectos. Los datos se organizan por idioma; la lista consultada por la vista ya incorpora `descriptionVisual` y medios opcionales. El código del detalle incluye un fallback visual local si falta la configuración.

Los medios actuales aceptan cadenas y objetos. Los objetos pueden tener texto alternativo, caption y `type`; el visor trata `type === 'video'` como vídeo y el resto como imagen. Hay proyectos sin media; el botón no aparece en ese caso. Los datos contienen al menos un caso de vídeo explícito (`type: 'video'`). La función que construya slides debe conservar esta normalización y no inventar medios.

## 2. Responsabilidades actuales y reutilización

| Funcionalidad | Propietario actual | Reutilización/decisión objetivo |
|---|---|---|
| Modal de detalle y cierre | `ProjectDetailModal` | Mantenerlo como propietario del Modal en el flujo de detalle; pasar navegación al viewer. |
| Estado Description/Media | `ProjectDetailModal` | Sustituir gradualmente por índice/tipo de slide en `ProjectContentViewer`. |
| Normalización de `images` / `image` | `ProjectDetailModal` y `ProjectCard` | No duplicar una tercera vez; extraer una función pura sólo si se valida equivalencia y la extracción no requiere tocar `ProjectCard`. |
| Título, fecha, texto, tags y enlaces | `ProjectDetailModal` | Encapsular en `DescriptionSlide`, conservando componentes Mantine, i18n y acciones reales. |
| Fallback SVG | `ProjectDetailModal` | Mantener sin cambios en la primera migración; centralizar sólo si la futura API lo necesita. |
| Composición SVG | `ProjectDescriptionVisual` + `projectVisuals/` | Reutilizar sin modificar renderer ni datos durante esta fase. |
| Índice, zoom, paneo y gestos de media | `ProjectImagesViewer` | Mantener el motor probado; integrarlo mediante una frontera de media con props explícitas. |
| Navegación/contador/thumbnails de media | `ProjectImagesViewer` | Reutilizar primero para equivalencia; luego ampliar a la secuencia heterogénea. |
| Modal de galería directa | `ProjectImagesModal` | Conservar como adaptador independiente y mantener su API pública. |
| Selección/activación de galería | `ProjectCard` | Exclusivo de la card y fuera de la migración. |

No hay actualmente dos implementaciones del motor de zoom o navegación: ambas rutas montan el mismo `ProjectImagesViewer`. Sí hay dos shells Modal con estilos y comportamiento de cierre adaptados a sus flujos, dos lugares que normalizan medios (`ProjectCard` y `ProjectDetailModal`) y dos modelos de navegación separados: cambio `description/media` en el detalle frente a índice circular de media en el viewer. La migración debe resolver la secuencia unificada sin confundir estas duplicaciones con una duplicación del motor multimedia.

## 3. Arquitectura objetivo

```text
ProjectDetailModal (un único Modal raíz; dueño de opened, cierre y foco)
└── ProjectContentViewer (slides e índice activo para el detalle)
    ├── DescriptionSlide (SVG/composición + HTML/Mantine accesible)
    ├── VisualSlide (ProjectDescriptionVisual existente)
    └── MediaSlide (frontera hacia el motor de media existente)
        ├── Image (zoom/paneo)
        └── Video (controles del navegador)

Galería directa, contrato preservado:
ProjectCard (sin cambios)
└── ProjectImagesModal (Modal independiente/adaptador)
    └── ProjectImagesViewer o adaptador de media compatible
```

El viewer del detalle controla la secuencia completa. El Modal raíz sigue perteneciendo a `ProjectDetailModal`; las diapositivas no crean overlays ni modales. La ruta de galería directa conserva su propio Modal. No se propone que un Modal se anide dentro de otro.

### Contrato mínimo propuesto

```jsx
<ProjectContentViewer
  project={project}
  slides={createProjectSlides(project)}
  initialSlide={0}
  onClose={handleClose}
  onSlideChange={handleSlideChange}
/>
```

`slides` y `onSlideChange` son conceptos útiles para el diseño, pero la API final debe reducirse a lo necesario al implementar. Si el viewer puede derivar slides de `project`, no se debe pasar a la vez un `project` y una lista que repita datos sin motivo. `onClose` sólo delega al propietario del Modal. La ruta directa seguirá usando el contrato actual de `ProjectImagesModal` y no necesita conocer `ProjectContentViewer`.

## 4. Modelo y secuencia de slides

Una función pura, por ejemplo `createProjectSlides(project)`, será responsable del orden y normalización. Mantendrá el objeto original como fuente de verdad; no duplicará las composiciones ni mutará datos.

```js
[
  { type: 'description', project },
  { type: 'visual', project, visualData },
  { type: 'image', src, alt, caption },
  { type: 'video', src, alt, caption },
]
```

| Tipo | Datos mínimos | Render/control | Thumbnail/accesibilidad |
|---|---|---|---|
| `description` | `project` | HTML/Mantine; sin zoom; enlaces y botones nativos. | Miniatura identificable como “Descripción”; controles con nombres traducidos. |
| `visual` | `project`, `visualData` | `ProjectDescriptionVisual`; sin zoom inicialmente. | Mini preview SVG o icono/etiqueta “Visual”; título accesible. |
| `image` | `src`, `alt`, `caption?` | Imagen existente; zoom, paneo y restablecimiento. | Thumbnail de imagen, texto alternativo y botón con nombre/posición. |
| `video` | `src`, `alt?`, `caption?` | Vídeo existente con controles; sin zoom de imagen. | Preview de vídeo e icono/etiqueta de vídeo; fallback accesible si falla. |

La secuencia es siempre Description, Visual, después cada elemento de media en el orden de datos. Si `descriptionVisual` falta, se usa el mismo fallback local que hoy en `ProjectDetailModal`, de modo que la segunda slide siga definida. Si el proyecto tiene `images` no vacío se usa ese array; si no, se deriva un medio del `image` existente; si no tiene ninguno, no se generan slides media. `type === 'video'` se conserva explícitamente y los restantes elementos mantienen el comportamiento actual de imagen.

## 5. Description Slide

La composición debe combinar el SVG visual reutilizable como fondo/estructura con contenido HTML/Mantine superpuesto. La información interactiva nunca se rasteriza ni se codifica como texto únicamente dentro del SVG. Permanecen como nodos reales, seleccionables y traducibles: featured, título, fecha, descripción larga o corta, tags, demo, backoffice, descargas/instalación y GitHub.

La implementación debe reutilizar los datos y textos ya mostrados por `ProjectDetailModal`; no introduce `descriptionVisual` nuevo, migración de proyectos ni strings visibles hardcodeados. `ProjectDescriptionVisual` ya produce un SVG con nombre accesible basado en el proyecto. Al utilizarlo detrás de HTML equivalente, la implementación deberá evitar anunciar dos veces el mismo texto (decidir explícitamente si el visual es decorativo en esa composición o conservar su semántica). El CTA actual “Ver imágenes y vídeos” pasa a seleccionar el primer slide de tipo `image` o `video`, sin abrir otro Modal; si no hay medios, permanece oculto como hoy.

## 6. Visual Slide

La segunda slide renderiza el `descriptionVisual` del proyecto mediante la API existente:

```jsx
<ProjectDescriptionVisual
  project={project}
  visualData={project.descriptionVisual || DEFAULT_DESCRIPTION_VISUAL}
/>
```

No se cambia `ProjectDescriptionVisual.jsx`, `projects.js` ni `src/data/projectVisuals/` en la implementación inicial. El fallback actual continúa siendo el valor de respaldo. El SVG es una slide navegable, sin controles de zoom específicos, y su miniatura debe ser liviana: usar una representación resumida/icono si capturar una miniatura real requiere render extra.

## 7. Media Slides y compatibilidad

La fase de integración debe preservar el comportamiento que existe en `ProjectImagesViewer`: índice y navegación circular, zoom de imagen (rueda, clic y botones), paneo, Escape condicionado por zoom, preload de medios vecinos, estados de error, captions, controles de vídeo, thumbnails, swipe/pinch y responsive. No se debe sustituir esa lógica al mismo tiempo que se cambia el modelo de slides.

La frontera recomendada es extraer o encapsular la presentación/gestos de media como una unidad que reciba el slide activo y exponga las acciones necesarias. Después `ProjectContentViewer` puede suministrarle los datos del slide activo. Para la galería independiente, `ProjectImagesModal` seguirá adaptando su array `images` a una secuencia que contenga sólo medios; las flechas, contador y thumbnails de esa ruta deben seguir representando únicamente el conjunto original de la card. Esta distinción mantiene compatible el flujo sin añadir Description/Visual a la galería directa.

No se recomienda convertir de golpe el `ProjectImagesViewer` actual en un componente que también renderice descripción y SVG: mezcla responsabilidades, altera controles y hace difícil validar la equivalencia de la galería. Una vez demostrada la frontera común, puede mantenerse `ProjectImagesViewer` como adaptador de compatibilidad o renombrar/extraer internamente el motor; `ProjectCard` no debe participar en esa decisión ni cambiar.

## 8. Navegación, contador y thumbnails

- Flechas y teclado recorren la secuencia completa en el detalle, independientemente del tipo. Mantener el comportamiento circular actual en los extremos; ocultar flechas cuando sólo haya una slide. En móvil se conservan objetivos táctiles adecuados y swipe sólo se interpreta sobre imágenes según la lógica probada.
- El contador representa posición y total de la secuencia (`01 / N`), incluidos Description y Visual. En galería directa continúa contando sólo los medios.
- Thumbnails de Description/Visual usan etiqueta/icono o una miniatura sencilla; imagen conserva preview; vídeo conserva preview e indicador. Todos los items son botones con etiqueta accesible y estado activo expuesto, y el strip continúa desplazando el activo a la vista.
- La selección de thumbnail reinicia zoom/paneo al navegar desde una imagen y limpia el estado de error aplicable al medio nuevo. No se debe permitir que zoom de una imagen se filtre a otra slide.
- Ocultar/mostrar thumbnails y caption se mantienen cuando son aplicables. Los controles se determinan por tipo: zoom sólo en `image`, controles nativos en `video`, navegación global en todos los tipos.

## 9. Integración con ProjectDetailModal

1. `ProjectDetailModal` conserva `opened`, el callback de cierre y la raíz Mantine Modal.
2. Su estado actual `description/media` evoluciona a índice de slide; la apertura de un proyecto nuevo y el cierre comienzan/restablecen en índice 0 (`description`).
3. Modal conserva trampa/retorno de foco y cierre externo coherentes. Escape tiene un solo propietario a la vez: con zoom de imagen primero restablece zoom; en cualquier otro estado cierra, salvo que una política de navegación existente especifique explícitamente otra cosa. No deben coexistir dos listeners que cierren o consuman el mismo Escape.
4. El contenido descriptivo y sus acciones migran a `DescriptionSlide`; el CTA selecciona el primer medio real.
5. La modalidad de tamaño/estilos del Modal debe permitir las slides heterogéneas sin cambiar dimensiones involuntariamente entre Description, Visual y Media. Las diferencias de pantalla completa en móvil se definirán en el shell del detalle, no en una slide interna.
6. Un cambio de proyecto reinicia slide, zoom, pan, error y foco temporal del viewer. Mantine debe restaurar el foco al elemento que abrió el Modal al cerrarlo.

## 10. Compatibilidad con ProjectCard

**ProjectCard.jsx NO forma parte de esta migración. La galería directa debe conservar su comportamiento actual.** No cambiar props, markup, estilos, eventos, apertura/cierre ni selección de imágenes de la card. `ProjectImagesModal` conserva su API y su Modal independiente. La validación de regresión debe cubrir variantes `default`, `carousel` y `list`, y confirmar que la galería directa sigue ofreciendo los medios, navegación, zoom, vídeo, teclado, tacto y cierre existentes.

## 11. Rendimiento y carga

El proyecto carga `FeaturedProjects` directamente desde Home y este importa `ProjectDetailModal`; `Projects` también importa el modal estáticamente. `ProjectCard` importa `ProjectImagesModal`, que importa el viewer y sus dependencias, de modo que la galería estática es parte del grafo de UI de cards. `projects.js` importa estáticamente las 19 composiciones desde `projectVisuals/index.js`, y ambas rutas de idioma asignan `descriptionVisual` a sus registros. La configuración SVG no se carga hoy bajo demanda simplemente porque el modal todavía esté cerrado.

La arquitectura nueva no debe sumar una segunda copia del motor multimedia ni eager-load de dependencias pesadas en el entry route. En implementación, medir el bundle antes/después y aprovechar la deduplicación de módulos compartidos. Una carga lazy del contenido de detalle sólo debe introducirse si mantiene el contrato de apertura/foco y no rompe el modal de Home; no es requisito introducir una optimización aparte en esta migración. Si se considera cargar visuales bajo demanda, primero comprobar el impacto real: las visuales se importan desde el módulo de datos común y no se deben migrar las 19 para resolver anticipadamente un problema no medido.

## 12. Estrategia incremental y archivos

Cada etapa debe quedar en un commit separado, con su propia validación y posibilidad de rollback.

| Etapa | Trabajo | Archivos a modificar/crear | Criterio de salida |
|---|---|---|---|
| A — Contrato/adaptador | Añadir modelo puro de slides y pruebas manuales de casos de datos; no cambiar flujos visibles. | Nuevo `src/utils/createProjectSlides.js` (o módulo pequeño equivalente); tests sólo si la infraestructura existente los admite sin dependencias. | Orden correcto, fallback, strings/objetos, vídeo, media vacía. |
| B — Frontera de media | Extraer presentación/estado de media sin cambiar UI ni contrato público del wrapper. | Nuevo módulo de media; modificar `ProjectImagesViewer.jsx`; sólo si hace falta `ProjectImagesModal.jsx`. | Galería directa visual/funcionalmente equivalente. |
| C — Equivalencia | Validar teclado, zoom/Escape, navegación, previews, video, errores y touch usando sólo medios. | Sin cambios de `ProjectCard.jsx`; ajustes acotados al módulo nuevo y wrappers de media. | No regresión en la galería independiente. |
| D — Description Slide | Encapsular contenido actual como slide accesible, manteniendo links, i18n y fallback. | Nuevo `src/components/ProjectDescriptionSlide.jsx`; extracción acotada de `ProjectDetailModal.jsx`. | Description coincide funcionalmente con el detalle actual. |
| E — Visual Slide | Añadir slide SVG usando renderer y datos existentes. | Nuevo `src/components/ProjectVisualSlide.jsx` sólo si aporta una frontera útil; modificar `ProjectContentViewer.jsx`. | Visual correcto con proyectos y fallback; sin cambios al renderer/configs. |
| F — Secuencia nueva | Crear viewer de contenido, navegación global, thumbnails tipados y controles contextuales. | Nuevo `src/components/ProjectContentViewer.jsx`; modificar fronteras de media/slide creadas en B/D/E. | Secuencia Description → Visual → media y CTA selecciona primer medio. |
| G — Integración de detalle | Conectar el viewer al único Modal actual y retirar el cambio de vista description/media una vez validado. | Modificar `ProjectDetailModal.jsx`; posiblemente `ProjectImagesViewer.jsx` y `ProjectImagesModal.jsx` para adaptadores. | Un Modal en detalle; reapertura/cambio de proyecto empieza en Description. |
| H — Cierre de migración | Auditoría de imports, bundle, accesibilidad, responsive y flujo directo; eliminar sólo duplicación demostrada. | Archivos anteriores; `ProjectCard.jsx` explícitamente excluido. | lint/build, QA de ambas rutas y diff dentro del alcance. |

La tabla presenta una secuencia técnica propuesta, no autorización para adelantar todas las etapas en una sola rama. Los módulos de slide auxiliares son condicionales: evitar crear envoltorios que sólo reenvíen props sin aislar responsabilidad.

## 13. Riesgos

| Riesgo | Mitigación |
|---|---|
| El índice activo de medios cambia al incluir Description y Visual. | Separar la lista fuente de medios del índice global; adaptar con una única función y probar saltos entre tipos. |
| Zoom/pan/error sobreviven a una transición de slide. | Reiniciar estado al cambiar tipo o identidad de medio y también al cambiar proyecto/cerrar. |
| El Modal captura Escape a la vez que el viewer. | Centralizar Escape o asegurar explícitamente un solo propietario, conservando reset de zoom como prioridad. |
| Cambio de shell altera foco, overlay, scroll lock, dimensiones o responsive. | Mantener la raíz Mantine existente y validar teclado, foco de retorno y breakpoints antes de retirar wrappers antiguos. |
| SVG accesible anuncia título/description duplicados frente a HTML overlay. | Definir la semántica del SVG en la Description Slide y probar lector de pantalla/árbol accesible. |
| Miniaturas mixtas vuelven ambiguos los controles actuales ligados a `hasMultipleImages`. | Cambiar la condición a cantidad de slides en el detalle; mantener cantidad de media en el adaptador directo. |
| Normalización divergente entre Card y detalle. | No tocar Card; preservar su normalizador actual y probar igualdad de orden/tipo con fixtures representativos antes de extraer utilidades comunes. |
| Vídeos secundarios en thumbnails elevan costo de red/decodificación. | Reutilizar preview actual durante la equivalencia; medir y considerar poster/thumbnail liviano en una etapa posterior sin cambiar reproducción principal. |
| Bundle inicial crece por nuevas imports o duplicación de viewer. | Revisar reportes de build y evitar implementación duplicada; evaluar lazy sólo con medición y pruebas de foco. |
| Proyectos sin medios o visual explícito producen una secuencia incompleta. | Fallback SVG existente garantiza Visual; CTA sólo aparece si la secuencia realmente contiene media. |

## 14. Rollback

1. Cada etapa se entrega en un commit independiente y pequeño.
2. Antes de la integración (A–F), el detalle y `ProjectImagesModal` siguen apuntando al flujo vigente; revertir el commit de la etapa nueva no requiere migrar proyectos.
3. En G, conservar los componentes y rutas anteriores hasta terminar QA; si falla el viewer nuevo, revertir únicamente el commit de integración y volver a `ProjectDetailModal` con `description/media` y `ProjectImagesViewer`.
4. No borrar `ProjectImagesViewer` ni `ProjectImagesModal` en el mismo commit que integra la secuencia. Sólo retirar código duplicado después de confirmar el adaptador directo y dejar esa limpieza en otro commit.
5. Nunca revertir ni modificar datos visuales para reparar una regresión de navegación. `ProjectCard.jsx` permanece fuera de los commits de migración.

## 15. Archivos propuestos

### Existentes que podrían modificarse por etapa

- `src/components/ProjectDetailModal.jsx` — estado y conexión del flujo de detalle (G).
- `src/components/ProjectImagesViewer.jsx` — extracción/adaptación incremental de la frontera de media (B–C y, si se confirma, G).
- `src/components/ProjectImagesModal.jsx` — sólo si necesita adaptar el contrato legacy sin cambiar su API pública (B/G).
- `src/components/ProjectImagesModal.css` — ajustes de layout estrictamente necesarios para la frontera compartida, preservando apariencia del modo directo.

### Nuevos, sólo si la etapa los justifica

- `src/utils/createProjectSlides.js` — construcción pura de secuencia/normalización para el detalle (A).
- `src/components/ProjectContentViewer.jsx` — índice global, navegación y render por tipo (F).
- `src/components/ProjectDescriptionSlide.jsx` — contenido HTML de descripción separado (D).
- `src/components/ProjectVisualSlide.jsx` — opcional; no crear si un case pequeño en el viewer es suficiente (E).
- Un componente/módulo de media compartido — nombre por decidir al extraer una frontera concreta en B; no duplicar el motor.

### Explícitamente fuera de alcance

- `src/components/ProjectCard.jsx` — NO modificar; conservar galería directa.
- `src/components/ProjectDescriptionVisual.jsx` — renderer existente permanece intacto.
- `src/data/projects.js` y `src/data/projectVisuals/` — sin migración ni edición de las 19 composiciones.
- `src/pages/Projects.jsx`, `src/components/FeaturedProjects.jsx`, routing, traducciones y dependencias — no cambiar en esta fase; sólo reconsiderar consumidores si una implementación posterior demuestra una necesidad.
- `global.css` y tema — no son necesarios para este diseño.

## Estado tras Fase 20

La Fase 19 añadió `ProjectContentViewer` para `image` y `video`, delegando la presentación multimedia en `ProjectImagesViewer`. La Fase 20 agrega `ProjectDescriptionSlide` y el tipo `description`: la descripción queda como HTML/Mantine sobre un SVG genérico decorativo, y el CTA cambia al primer medio dentro del viewer aislado. El contenido de media todavía usa el motor existente. El nuevo flujo no está conectado a `ProjectDetailModal`; el tipo `visual` queda para la siguiente fase. Ver [informe de Fase 19](project-content-viewer-phase-19.md) y [informe de Fase 20](project-content-viewer-phase-20.md).

La integración futura debe unificar la secuencia completa, thumbnails tipados, navegación, reset de estado y shell modal antes de conectar el nuevo viewer al detalle. Mantener la galería directa desde `ProjectCard` independiente en variantes default, carousel y list.
