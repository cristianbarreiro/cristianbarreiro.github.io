# Fase 15 — Remediación H1/H2 y QA de accesibilidad

**Fecha:** 2026-10-03
**Alcance:** remediación de los hallazgos H1 y H2 de Fase 14. No se optimizó el bundle, no se modificaron el renderer, las visuales, los estilos ni la galería.

## Resultado

| Hallazgo | Estado antes | Estado después | Evidencia |
|---|---|---|---|
| H1 — Asset de MCP Secure Delete | Problema | **RESUELTO** | No existe un archivo válido de MCP Secure Delete en el repositorio. La referencia rota se retiró de los datos ES/EN; el proyecto queda con `image: null` e `images: []`. SSR confirma la estructura y el repositorio ya no contiene la URL inválida. |
| H2 — Cierre sin nombre accesible | Problema | **RESUELTO** | Se añadió `closeButtonProps` a Mantine `Modal`, con la clave traducida existente `underConstruction.close`. El HTML renderizado por Mantine contiene el nombre accesible en ambos idiomas. |

## H1 — MCP Secure Delete

### Búsqueda y decisión

- Se buscaron nombres y variantes de `mcp-secure-delete`, `Captura`, `screenshot` e imágenes en todo el repositorio.
- La única coincidencia de asset era `/images/projects/mcp-secure-delete/Captura.png` en `src/data/projects.js`; no existe `public/images/projects/mcp-secure-delete/Captura.png` ni otra imagen que corresponda al proyecto.
- No se reutilizó una imagen de otro proyecto ni se creó un placeholder.
- La entrada del proyecto se conserva en ES y EN, pero ahora declara `image: null` e `images: []`. Título, descripciones, fecha, tags, URLs, ID, visual y orden permanecen intactos.

### Validación

- Vite SSR comprobó ambos idiomas: 19 proyectos activos, 19/19 con `descriptionVisual`; MCP Secure Delete tiene cero imágenes.
- La resolución de `projectImages` queda vacía para esa entrada. `hasImages` resulta falso, por lo que no se presenta el botón «Ver imágenes y vídeos» y no se solicita el asset ausente.
- La Description y su visual permanecen disponibles. La rama Media no se abre desde un proyecto sin medios, de acuerdo con la condición existente.
- La referencia rota no aparece ya en `projects.js`; la ruta de archivo tampoco existe en `public/`.

## H2 — Nombre accesible del botón de cierre

### Implementación y traducción

- Se reutilizó la clave genérica existente `underConstruction.close`; no se añadieron claves ni se modificaron los JSON.
- La traducción ES es **«Cerrar»** y la EN es **«Close»**.
- `ProjectDetailModal` pasa `aria-label={t('underConstruction.close')}` por `closeButtonProps`, API soportada por la versión Mantine instalada. La implementación de Mantine reenvía esas props al mismo `ModalCloseButton`; no se reemplazó el control ni se alteró su estilo.
- SSR de Mantine verificó que el botón renderizado contiene `aria-label` tanto para «Cerrar» como para «Close».

### Teclado, foco y Escape

- `withCloseButton={!isMediaView}` y `closeOnEscape={!isMediaView}` permanecen sin cambios.
- En Description, Escape sigue habilitado para cerrar el detalle. En Media, el visor conserva el manejador existente: Escape reinicia zoom si está ampliado y, a escala 1, llama al cierre.
- Mantine mantiene sus valores por defecto `trapFocus: true` y `returnFocus: true`; no se modificaron ni se introdujo lógica nueva de foco. El cambio solo añade un atributo accesible al control existente.
- **Tipo de evidencia:** se verificaron el HTML renderizado de la etiqueta accesible y la configuración/código de teclado y foco. No se realizó una secuencia manual de Tab/Escape en un navegador interactivo durante esta ejecución; no hay una herramienta de control de navegador disponible en esta sesión. Por ello no se presenta esa interacción física como prueba ejecutada.

## Regresión

| Área | Resultado | Evidencia / alcance |
|---|---|---|
| Description | PASS | Los datos y el renderer no cambiaron; el fallback sigue declarado y conectado en `ProjectDetailModal`. SSR confirma 19/19 visuales en ambos idiomas. |
| Media de MCP Secure Delete | PASS | Queda correctamente sin medios. La acción de Media se condiciona a imágenes disponibles y no debe aparecer. |
| Description ↔ Media en proyecto con medios | PASS de regresión | No se alteró la transición ni el visor. Socratica/PrivGvard se probaron en Fase 14; `ProjectImagesViewer.jsx` no se modificó en Fase 15. |
| Cierre de Media | PASS de regresión | El visor mantiene su botón interno y el callback existente; los controles multimedia no se modificaron. |
| Galería directa de ProjectCard | PASS de regresión | ProjectCard y `ProjectImagesModal` no se modificaron. La galería directa fue validada en Fase 14; la remediación solo toca el `Modal` de detalle y el medio de MCP. |
| Fallback | PASS | `DEFAULT_DESCRIPTION_VISUAL` continúa definido y conectado; no se forzó ningún proyecto al fallback. |
| Desktop / 390 px | PASS de regresión | Fase 14 verificó los 19 detalles en ambas dimensiones. Fase 15 no modifica CSS, estructura de contenido ni estilo; `closeButtonProps` solo agrega un nombre accesible al mismo botón. |
| Teclado / foco | PASS por inspección de implementación; ver limitación indicada | Escape y política de foco de Mantine permanecen intactos. No hubo prueba manual de navegación con teclado en navegador en esta sesión. |
| Consola / asset | PASS por ruta del código | El detalle ya no contiene la URL del asset ausente y no genera una imagen para cargar. La consola de un navegador no se volvió a inspeccionar interactivamente en esta sesión. |
| i18n | PASS | Clave reutilizada en ambos idiomas; 306 claves por idioma y paridad exacta. |
| `npm run lint` | PASS | Código de salida 0. |
| `npm run build` | PASS | Build completado. Se mantiene el warning existente de chunks mayores a 500 kB; queda fuera de esta fase. `TechGlobe` continúa en chunk separado. |
| `git diff --check` | PASS | Sin errores de whitespace en el diff de esta fase. |

## Archivos modificados

- `src/data/projects.js` — solamente las dos referencias de medios inválidas de MCP Secure Delete (ES y EN), sustituidas por el estado sin media `image: null`, `images: []`.
- `src/components/ProjectDetailModal.jsx` — nombre accesible localizado en el close button existente.
- `docs/project-description-visual-remediation.md` — este reporte.

No se modificaron traducciones, CSS, `ProjectDescriptionVisual.jsx`, `ProjectImagesViewer.jsx`, `ProjectImagesModal.jsx`, `ProjectCard.jsx`, datos de otros proyectos ni módulos de visuales.

## Cierre de fase

H1 y H2 están resueltos. La limitación de validación manual de teclado/foco queda explícita arriba; la implementación conserva la política de Mantine y los handlers existentes. No se inicia optimización de bundle ni una fase adicional de QA.
