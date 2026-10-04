# Fase 14 — QA global de `descriptionVisual`

**Fecha:** 2026-10-03
**Alcance:** auditoría de los 19 proyectos activos y sus vistas de detalle/medios. No se modificó código de aplicación ni datos.
**Resultado global:** los 19 visuales renderizan y responden a los dos tamaños revisados. Se registran dos hallazgos importantes: un recurso multimedia inexistente para MCP Secure Delete y el botón de cierre del detalle sin nombre accesible detectable.

## Resumen ejecutivo

- `getProjects('es')` y `getProjects('en')` devuelven 19 proyectos activos, con los mismos IDs y el mismo orden. Los 19 tienen `descriptionVisual`; no se activó el visual fallback.
- Los 19 detalles se abrieron y revisaron a 1280 × 800 y 390 × 844. El modal queda dentro del viewport, no hay overflow horizontal del documento ni contenido SVG fuera del `viewBox`.
- Se probó el ciclo Description → Media → Description dentro del mismo modal y la galería independiente accesible desde una card. Imágenes múltiples, navegación, thumbnails y un elemento de vídeo se verificaron en proyectos representativos.
- Se encontraron 2 hallazgos importantes y 1 observación de tamaño de bundle. No se observaron fallos críticos ni defectos cosméticos consistentes.
- Validaciones: lint PASS; paridad i18n PASS (306 claves); build PASS; `git diff --check` PASS.

## Método y cobertura

1. Se enumeraron los proyectos activos desde la fuente de datos traducida (`getProjects`) en ambos idiomas; no se usó el orden de los módulos visuales para inferir cobertura.
2. Se abrió cada detalle en escritorio (1280 × 800) y móvil estrecho (390 × 844), y se inspeccionaron el rectángulo del modal, el ancho del documento, el `viewBox`, el ajuste del SVG y el texto dentro de sus límites.
3. Se ejercitaron las rutas de media en Socratica Social Network (imagen + vídeo, navegación y retorno), PrivGvard (cinco imágenes, thumbnails y navegación) y MCP Secure Delete (estado de recurso ausente). La galería de card se probó por separado con Socratica.
4. Se revisaron disponibilidad de recursos locales declarados, estructura ES/EN, etiquetas SVG, consola, dependencias del shell visual y salida de producción.
5. No se inventó un proyecto sin `descriptionVisual` ni se alteraron datos para forzar el fallback: su declaración y ruta de uso se comprobaron estáticamente.

La inspección manual de todas las variantes del reproductor no se repitió para cada proyecto porque el visor es compartido. Los casos representativos cubren imagen simple, varias imágenes, imágenes más vídeo, proyecto sin medios y medio con asset ausente.

## Matriz de los 19 proyectos

Convenciones: **PASS** = revisado sin defecto específico; **WARN** = hallazgo que afecta la categoría; **N/A** = el proyecto no declara medios. El nombre accesible ausente en el botón de cierre es transversal a los 19 detalles.

| # | Proyecto (ES) | Visual | Desktop | 390 px | Overflow | SVG / texto | Media | i18n / datos | Accesibilidad | Consola | Rendimiento | Estado |
|---:|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | FollowLens — Analizador de relaciones de Instagram | PASS | PASS | PASS | PASS | PASS | N/A | PASS | WARN global | PASS | PASS | WARN global |
| 2 | PrivGvard — Privacidad de Cámara y Micrófono | PASS | PASS | PASS | PASS | PASS | PASS | PASS | WARN global | PASS | PASS | WARN global |
| 3 | Desktop Calendar | PASS | PASS | PASS | PASS | PASS | N/A | PASS | WARN global | PASS | PASS | WARN global |
| 4 | AntiSpam MCP — InboxGuardian | PASS | PASS | PASS | PASS | PASS | N/A | PASS | WARN global | PASS | PASS | WARN global |
| 5 | Rumbo Platform — Plataforma de Transporte | PASS | PASS | PASS | PASS | PASS | N/A | PASS | WARN global | PASS | PASS | WARN global |
| 6 | PayFlow — Simulador de Pasarela de Pagos | PASS | PASS | PASS | PASS | PASS | N/A | PASS | WARN global | PASS | PASS | WARN global |
| 7 | MCP Secure Delete | PASS | PASS | PASS | PASS | PASS | WARN | PASS | WARN global | PASS | PASS | WARN |
| 8 | CDEV Studios | PASS | PASS | PASS | PASS | PASS | PASS | PASS | WARN global | PASS | PASS | WARN global |
| 9 | NovaVolt E-commerce | PASS | PASS | PASS | PASS | PASS | PASS | PASS | WARN global | PASS | PASS | WARN global |
| 10 | Boutique de Calzado | PASS | PASS | PASS | PASS | PASS | PASS | PASS | WARN global | PASS | PASS | WARN global |
| 11 | Sistema de Semáforos | PASS | PASS | PASS | PASS | PASS | N/A | PASS | WARN global | PASS | PASS | WARN global |
| 12 | Sistema de gestión bibliotecaria | PASS | PASS | PASS | PASS | PASS | N/A | PASS | WARN global | PASS | PASS | WARN global |
| 13 | Sistema de Mensajería | PASS | PASS | PASS | PASS | PASS | N/A | PASS | WARN global | PASS | PASS | WARN global |
| 14 | Genius — Plataforma de Gestión Empresarial | PASS | PASS | PASS | PASS | PASS | N/A | PASS | WARN global | PASS | PASS | WARN global |
| 15 | Perfumería Cataleya — E-commerce Demo | PASS | PASS | PASS | PASS | PASS | PASS | PASS | WARN global | PASS | PASS | WARN global |
| 16 | E-commerce ShopHub | PASS | PASS | PASS | PASS | PASS | PASS | PASS | WARN global | PASS | PASS | WARN global |
| 17 | Web de Automotora | PASS | PASS | PASS | PASS | PASS | PASS | PASS | WARN global | PASS | PASS | WARN global |
| 18 | Socratica Social Network | PASS | PASS | PASS | PASS | PASS | PASS | PASS | WARN global | PASS | PASS | WARN global |
| 19 | Sistema de Control de Versiones | PASS | PASS | PASS | PASS | PASS | N/A | PASS | WARN global | PASS | PASS | WARN global |

**Evidencia común de la matriz:** modal de escritorio de 620 px, dentro del viewport; en 390 px, modal de aproximadamente 351 px y documento de 390 px sin desplazamiento horizontal. El SVG conserva `viewBox="0 0 1000 620"`, `preserveAspectRatio="xMidYMid meet"`, `role="img"`, título y descripción accesibles. El texto visible medido no sale del rectángulo SVG. No se detectó overflow de tags.

## Hallazgos

### H1 — Recurso multimedia declarado inexistente

- **Severidad:** importante; ámbito: MCP Secure Delete.
- **Evidencia:** `src/data/projects.js` declara `/images/projects/mcp-secure-delete/Captura.png`. El archivo no existe bajo `public/`. En la vista Media, el proyecto muestra el estado de contenido no disponible y no una imagen. Description → Media sigue funcionando, pero el medio declarado no puede presentarse.
- **Impacto:** el detalle y el visual SVG funcionan; la evidencia multimedia de este proyecto queda rota.
- **Acción sugerida para una fase posterior:** confirmar el asset correcto con el propietario del proyecto y actualizar la referencia o incorporar el archivo aprobado. No se modificó `projects.js` ni se sustituyó el recurso durante esta auditoría.

### H2 — Control de cierre del detalle sin nombre accesible

- **Severidad:** importante; ámbito: los 19 detalles.
- **Evidencia:** el árbol DOM accesible muestra el botón de cierre del modal como un botón vacío, sin texto, `aria-label` ni nombre accesible. Una consulta por rol de botón con nombre “cerrar/close” no lo encuentra. Los botones del visor multimedia sí cuentan con etiquetas traducidas.
- **Impacto:** quien navega con lector de pantalla no recibe un nombre que identifique la acción de cierre.
- **Acción sugerida para una fase posterior:** asignar al control un nombre accesible localizado y comprobar foco/teclado en ambos modos de color y en móvil. No se cambió el componente durante Fase 14.

### O1 — Advertencia de tamaño de bundle

- **Severidad:** observación, no fallo de QA visual.
- **Evidencia:** Vite produce un chunk principal de 1,024.30 kB sin comprimir (292.82 kB gzip) y `TechGlobe` en un chunk separado de 918.63 kB (248.62 kB gzip). La compilación avisa por chunks mayores a 500 kB. Los módulos de visuales suman aproximadamente 167 kB de fuente y el render revisado no mostró bloqueos perceptibles.
- **Lectura:** el desacoplamiento de `TechGlobe` se mantiene. La advertencia merece evaluación de rendimiento independiente; esta auditoría no atribuye el tamaño del chunk principal exclusivamente a `descriptionVisual` ni propone cambios de carga diferida aquí.

## Revisiones funcionales y visuales

### Modal y galería

- Description inicia al abrir cada proyecto; no se observó persistencia de la vista entre aperturas.
- Description → Media → Description se completó en el mismo modal y sin un segundo overlay. El proyecto con vídeo conservó el elemento en la navegación y mostró `readyState=4` al inspeccionarlo; no se inició reproducción automática para la auditoría.
- PrivGvard mostró 5 elementos, thumbnails y navegación de imagen.
- La galería directa abierta desde la card de Socratica mostró sus controles multimedia y navegación sin cargar el detalle, sin botón “Ver descripción” y sin modal anidado.
- En proyectos sin imágenes no aparece la acción “Ver imágenes y vídeos”.

### Diseño responsive y consistencia

- Los 19 modales permanecieron dentro del viewport a 390 × 844; el ancho del documento fue 390 px y `scrollWidth` del modal coincidió con su ancho visible.
- Títulos largos, incluido FollowLens, se envuelven sin salir del modal. Genius conserva sus 17 tags visibles en varias filas.
- El contenido SVG se ajusta proporcionalmente al ancho disponible; no se midieron nodos de texto fuera de los límites del SVG.
- Las diferencias compositivas previstas se mantienen: FollowLens usa shell propio, CDEV Studios presenta una composición compacta y PrivGvard utiliza el frame compartido sin divider. No se consideraron regresiones.
- La aplicación se revisó en tema oscuro. No se forzó el tema claro durante esta sesión; por ello, la cobertura visual de light mode queda **WARN / no ejercitada** a nivel de auditoría global, aunque los SVG usan colores definidos por sus módulos y la estructura de tema no se modificó.

### Datos, shell e internacionalización

- 19 IDs activos coinciden entre ES y EN; cada proyecto apunta al mismo objeto visual localizado en el código.
- Los 19 visuales declaran el mismo `viewBox` y el renderer genera título y descripción SVG. Hay 19 exports de proyecto y la composición usa referencias compartidas del shell donde corresponde; las excepciones observadas son decisiones compositivas existentes.
- Paridad de recursos i18n: 306 claves en cada idioma, sin diferencias.
- La ruta de fallback `project.descriptionVisual || DEFAULT_DESCRIPTION_VISUAL` está presente en `ProjectDetailModal.jsx`; no se forzó en runtime porque todos los proyectos activos tienen visual.
- No se encontraron errores ni warnings de consola durante los recorridos realizados.

## Validación ejecutada

| Comprobación | Resultado | Detalle |
|---|---|---|
| `npm run lint` | PASS | Código de salida 0, sin diagnósticos. |
| Paridad i18n | PASS | 306 claves ES/EN idénticas. |
| `npm run build` | PASS | Build Vite finalizó correctamente; `TechGlobe` sigue separado. Vite muestra la advertencia de tamaño indicada en O1. |
| `git diff --check` | PASS | Sin errores de whitespace en el informe. |

## Alcance y exclusiones

No se alteraron componentes, estilos, datos de proyecto, traducciones, dependencias ni configuración. Este informe no incorpora remediaciones, no fuerza un estado de fallback y no inicia la Fase 15. La verificación de light mode, reproducción manual de vídeo, foco/retorno de foco y navegación exhaustiva por teclado queda pendiente para una sesión de QA visual/interactiva dedicada.
