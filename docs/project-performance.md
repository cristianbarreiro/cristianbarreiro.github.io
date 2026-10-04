# Fase 16 — Auditoría y optimización de bundle

**Fecha:** 2026-10-03
**Alcance:** análisis del camino de carga inicial, `TechGlobe` y splitting de rutas. No se actualizaron dependencias ni se modificaron el renderer, los datos, CSS, `ProjectCard` o la galería.

## 1. Baseline

Build de producción antes de los cambios, Vite 7.3.0. Vite informa tamaños minificados y gzip en kB decimales:

| Asset | Tamaño | Gzip | Papel de carga |
|---|---:|---:|---|
| `index-Cb_XSKJQ.js` | 1,024.07 kB | 292.82 kB | Entry point estático |
| `index-BdZvuMvO.js` | 15.61 kB | 4.79 kB | Sección Tech Stack cargada al renderizar Home |
| `TechGlobe-BgyvIAim.js` | 918.63 kB | 248.62 kB | Módulo 3D, carga tras seleccionar la vista «globe» |
| CSS enlazado desde `index.html` | 271.35 kB | 41.99 kB | Estilos compartidos iniciales |
| CSS de Tech Stack diferido | 11.96 kB | 2.72 kB | Se carga con la sección Tech Stack |
| `index.html` | 1.34 kB | 0.68 kB | Shell HTML |

La Home monta Tech Stack mediante `React.lazy`, por lo que al resolver el primer render se añade su chunk y su CSS. Con ese criterio, el payload inicial estimado de Home era **1,324.33 kB / 343.00 kB gzip**, incluyendo HTML, CSS global, CSS de Tech Stack, entry JS y el chunk de Tech Stack. No incluye `TechGlobe`, que no se importa en la vista predeterminada `list`.

Vite emitía 3 chunks JavaScript. La ruta raíz solicita estáticamente el entry point; el chunk de Tech Stack se solicita al renderizar Home y el chunk 3D solo cuando se elige «globe».

## 2. Diagnóstico

### Main chunk

La configuración de Vite no definía `manualChunks`; `App.jsx` importaba estáticamente Home, About, Projects, Skills y Contact, aunque solo una ruta se muestra a la vez. Los módulos más grandes reportados por el análisis `generateBundle` de Rollup fueron:

| Módulo en el entry | Longitud renderizada reportada |
|---|---:|
| `react-dom-client.production.js` | 552.9 kB |
| `i18next.js` | 79.9 kB |
| `react-router` | 77.7 kB |
| `motion-dom` projection | 72.0 kB |
| `src/data/projects.js` | 67.1 kB |
| `@floating-ui/react`, core y DOM, en conjunto | 99.9 kB |
| `ThemeChanger.jsx` | 28.1 kB |
| `typeit` | 27.0 kB |
| `ProjectImagesViewer.jsx` | 24.2 kB |

Estas longitudes sirven para atribuir módulos; no son tamaños descargados independientes. Rollup tree-shakea y agrupa módulos, así que la medición de transferencia es la de los chunks minificados/gzip de las tablas.

`projects.js` aporta aproximadamente 67 kB renderizados al entry porque Home muestra proyectos destacados, importa los datos completos y puede abrir su detalle. Los módulos de visuales quedan disponibles en ese camino. Diferir cada visual requeriría cambiar el contrato de datos y cargar la definición al abrir el modal; se descartó por complejidad y riesgo funcional desproporcionados para esta fase.

`Contact.jsx` también se conserva en el entry porque `Home.jsx` renderiza el formulario en la misma página. Hacer lazy únicamente su ruta no aplazaría la carga. `framer-motion`, Mantine, i18n y el router tienen usos reales en Home y se conservan.

### TechGlobe

- `TechGlobe.jsx` importa `three`, `@react-three/fiber` y `@react-three/drei` (`Html`, `OrbitControls`).
- Rollup atribuye el mayor peso del chunk a Three.js (incluye `three.core.js` y `three.module.js`), seguido de React Three Fiber, `three-stdlib`/OrbitControls y Drei.
- El chunk medido es aproximadamente **918.63 kB / 248.62 kB gzip** en baseline.
- Ya está diferido en dos niveles: Home importa Tech Stack con `React.lazy`; dentro de Tech Stack, `TechGlobe` solo se monta mediante otro `React.lazy` cuando el usuario selecciona `globe`. La vista por defecto es `list`; en pantallas móviles la vista 3D no se ofrece.
- El grafo de chunks confirma que `TechGlobe` no forma parte del entry ni de la primera carga de Tech Stack. No se modificó: otra capa de splitting no reduce la descarga inicial y podría añadir complejidad a una interacción ya diferida.

## 3. Cambio realizado

`App.jsx` ahora declara About, Projects y Skills con `React.lazy` y las renderiza bajo una frontera `Suspense` local a la ruta, con `fallback={null}`. Así se conserva Layout/navbar mientras se resuelve el módulo de la página.

No se difirió Home, que es la entrada habitual, ni Contact, porque Home la utiliza directamente. Tampoco se cambió el splitting existente de Tech Stack/TechGlobe. No se usó `manualChunks`: separar paquetes sin aplazar su uso cambiaría la forma del bundle, no reduciría la transferencia inicial.

## 4. Resultado

Build después del cambio, medido con la misma versión y comando:

| Métrica | Antes | Después | Diferencia |
|---|---:|---:|---:|
| Entry JS | 1,024.07 kB / 292.82 gzip | 968.19 kB / 278.62 gzip | −55.88 kB / −14.20 gzip |
| JS de Home hasta resolver Tech Stack | 1,039.68 kB / 297.61 gzip | 990.43 kB / 286.19 gzip | −49.25 kB / −11.42 gzip |
| Payload inicial estimado de Home, incluido HTML y CSS | 1,324.33 kB / 343.00 gzip | 1,275.08 kB / 331.58 gzip | −49.25 kB / −11.42 gzip |
| `TechGlobe` | 918.63 kB / 248.62 gzip | 918.71 kB / 248.66 gzip | +0.08 kB / +0.04 gzip |
| Chunks JavaScript emitidos | 3 | 9 | +6 chunks diferidos |

La reducción estimada del payload inicial de Home es **49.25 kB (3.7%) sin comprimir** y **11.42 kB (3.3%) gzip**. El pequeño incremento de TechGlobe es variación de build/hash, sin cambio en sus imports.

Las páginas ahora se emiten como chunks dinámicos: About **13.37 kB / 3.34 gzip**, Projects **27.44 kB / 8.72 gzip** y Skills **10.39 kB / 3.27 gzip**. El análisis posterior confirma que `About.jsx`, `Projects.jsx` y `Skills.jsx` ya no están en el entry. Se cargan al visitar su ruta. Hay además chunks compartidos pequeños de `SegmentedControl`, iconos y estilos.

El warning de Vite para chunks mayores de 500 kB permanece: el entry mide 968.19 kB y TechGlobe 918.71 kB. No se ocultó ni se cambió el límite. `TechGlobe` está fuera del camino inicial y el entry continúa incluyendo dependencias compartidas y los datos necesarios para Home.

## 5. QA y validación

| Comprobación | Resultado | Evidencia |
|---|---|---|
| `npm run lint` | PASS | Código de salida 0. |
| `npm run build` | PASS | Build completado, con la advertencia conocida de chunks grandes. |
| `git diff --check` | PASS | Ejecutado antes del commit. |
| Preview HTTP smoke | PASS | Las rutas `/`, `/about`, `/projects`, `/skills` y `/contact`, y los chunks entry, páginas y TechGlobe respondieron HTTP 200. Esta comprobación valida el servidor SPA y la disponibilidad de assets, no el render interactivo del navegador. |
| Build graph | PASS | Entry contiene imports dinámicos a About, Projects, Skills y Tech Stack; Tech Stack mantiene su import dinámico de TechGlobe. Chunks de rutas emitidos. |
| Traducciones | PASS | No cambiaron; la estructura ES/EN queda intacta. |
| Fallback / visuales | PASS por alcance | `DEFAULT_DESCRIPTION_VISUAL`, los 19 datos visuales y el renderer no se modificaron. |
| Galería directa / ProjectCard | PASS por alcance | Ninguno de esos componentes ni sus dependencias se modificó. |

**QA interactivo limitado:** no se dispuso de control de navegador en esta ejecución. No se afirma una prueba manual post-cambio de navegación desktop/móvil, apertura de modal/media, interacción 3D o consola. El cambio está aislado a la carga de tres páginas; lint/build y el grafo compilado validan la forma del splitting, pero no sustituyen esa comprobación visual/manual. Fase 14 había revisado proyectos a 390 px y desktop antes de este cambio.

## 6. Limitaciones y decisiones

- El entry sigue siendo grande por React DOM y dependencias compartidas que necesita Home. No se intentó dividirlas artificialmente en vendor chunks porque no reduciría por sí solo las solicitudes iniciales.
- El módulo de proyectos continúa cargando datos/visuales de forma estática por el uso de proyectos destacados y detalle en Home. Convertirlo en carga dinámica por proyecto requeriría cambiar la arquitectura estabilizada; no se justifica con esta optimización acotada.
- TechGlobe sigue teniendo un chunk grande cuando se activa, pero la descarga ya está diferida hasta la selección explícita. Dividir o sustituir su funcionalidad queda fuera de esta fase.
- El warning de Rollup se conserva para seguimiento; optimizar más requiere medir rendimiento real y evaluar una fase separada.
