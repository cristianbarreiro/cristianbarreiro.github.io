# Auditoría de patrones de `descriptionVisual`

**Fase:** 10 — auditoría y diseño
**Alcance:** 11 configuraciones visuales y el renderer genérico actual.
**Resultado:** documentación solamente; no se modificó código de producción.

## 1. Resumen ejecutivo

Las 11 visuales usan un lienzo declarativo SVG de `1000 × 620`, un fondo `linearGradient`, un marco exterior idéntico y bindings para título y tags. El renderer puede expresar todas las configuraciones actuales con sus primitivas existentes. No hay evidencia que justifique ampliarlo ni crear componentes visuales semánticos en esta fase.

La repetición exacta más clara es el `rect` del marco exterior, presente en las 11 definiciones. Diez visuales comparten además la misma línea divisoria del encabezado; `privGvard` la coloca más abajo. Las listas de tecnologías también aparecen en las 11, pero cambian de posición, tipografía, separación y, en un caso, lado. Los diagramas, tarjetas y paneles internos tienen variaciones de estructura y significado que no justifican una abstracción común.

**Recomendación:** conservar ahora el renderer y las visuales. Para una Fase 11 acotada, evaluar la extracción de los dos descriptores de marco/divisor que se repiten literalmente, conservando una variante propia para el divisor de `privGvard`. No extraer listas de tecnologías, tarjetas, nodos, APIs ni flujos al renderer.

## 2. Inventario y método

Se leyeron directamente las definiciones exportadas por:

1. `privGvard`
2. `cdevStudios`
3. `followLens`
4. `novaVolt`
5. `cataleya`
6. `payFlow`
7. `rumbo`
8. `desktopCalendar`
9. `genius`
10. `antiSpamMcp`
11. `shopHub`

Los recuentos de primitivas incluyen nodos dentro de `group`. Los patrones semánticos cuentan una visual una vez cuando cumple el criterio indicado, aunque contenga varios ejemplos del patrón. «Conector» significa un `path`, `line` o `polyline` que relaciona etapas, nodos o módulos; se excluyen bordes, separadores y líneas propias de la interfaz del calendario. «Módulos repetidos» significa dos o más tarjetas pares de producto, servicio o cola con estructura equivalente dentro de la misma visual.

## 3. Matriz de patrones

| Patrón | Frecuencia | Proyectos | Forma actual | Reutilización real | Candidato a abstracción | Riesgo |
|---|---:|---|---|---|---|---|
| Marco exterior | 11/11 | Todas | `rect` idéntico: x=24, y=24, 952×572, radio 22, borde tokenizado de 1 | Exacta y estable | Sí, descriptor compartido de datos | Bajo; vigilar orden de pintura |
| Título enlazado | 11/11 | Todas | `text` con `content.bind: 'title'`; tamaño y baseline varían | Semántica común, estilo parcialmente variable | Ya resuelto por binding y primitivas | Bajo |
| Divisor del encabezado | 10/11 exacto; 11/11 aproximado | Todas; `privGvard` usa y=145 | `line` de x=25 a 975, normalmente y=126 | Alta salvo altura distinta en `privGvard` | Posible descriptor común con excepción declarativa | Bajo/medio |
| Panel lateral de tecnologías | 11/11 | Todas | Panel `rect` + `textList` enlazado a `tags`; 10 a la izquierda y FollowLens a la derecha | La semántica se repite, pero geometría y estilo varían | No como componente visual; `textList` ya cubre la operación común | Medio; posiciones y densidades distintas |
| Fondo degradado | 11/11 | Todas | Fondo `linearGradient` diagonal con tokens Mantine/acento | Tipo común, stops y orden varían | No | Medio; abstraerlo ocultaría diferencias de tono/dirección |
| Conectores de módulos o relaciones | 10/11 | Todas salvo `desktopCalendar` | `path`, `line`, `polyline` y nodos SVG | La primitiva se repite; la topología y el significado no | No; ya son primitivas de nivel A | Alto; los flujos no comparten semántica única |
| Módulos pares tipo tarjeta | 5/11 | `cdevStudios`, `novaVolt`, `genius`, `antiSpamMcp`, `shopHub` | Tarjetas de aplicaciones/servicios, productos, capacidades, colas o productos de tienda | Repetición interna, pero el contenido e iconografía son distintos | No en renderer; conservar como composición declarativa | Alto; una API común exigiría variantes por proyecto |
| Vista de storefront | 3/11 | `novaVolt`, `cataleya`, `shopHub` | Catálogo/productos o comercio, con distinto nivel de detalle | Dominio similar, layouts y función distintos | No por ahora | Medio/alto |
| Bloque rotulado como API/servicio | 4/11 | `cdevStudios`, `genius`, `antiSpamMcp`, `shopHub` | Texto/bloque dentro de un diagrama mayor | Coincide el tema; no la forma ni el papel | No | Alto; API, MCP action gate y servicios representan límites diferentes |
| Nodo de base de datos dibujado | 3/11 | `cdevStudios`, `payFlow`, `shopHub` | Cilindro hecho con primitivas (`ellipse`, `path` y/o `line`) | Símbolo reconocible, formas y contexto distintos | Posible patrón de datos solo si aumenta la frecuencia | Medio; el renderer ya permite esos símbolos |
| Aprobación humana explícita | 1/11 | `antiSpamMcp` | Etapa rotulada y conectada con revisión/confirmación | Específica | No | Alto; patrón exclusivo |
| Calendario de cuadrícula | 1/11 | `desktopCalendar` | Panel mensual con divisiones y eventos | Específico | No | Alto; único y dependiente del dominio |
| Motivo de seguridad explícito | 2/11 | `privGvard`, `antiSpamMcp` | Escudo/candado o gate de acción controlada | Tema común, composición distinta | No con la evidencia actual | Alto |

La frecuencia de conectores (10/11) no implica que exista un único diagrama reusable: incluye una ruta de transporte, una red de relaciones, un flujo de compra, una arquitectura de servicios y un proceso de aprobación.

## 4. Recuento de primitivas

Cada celda indica la cantidad de nodos de ese tipo en la configuración, incluidos descendientes de grupos.

| Visual | rect | circle | ellipse | line | path | polyline | polygon | text | textList | group |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| privGvard | 20 | 11 | 1 | 11 | 5 | 0 | 2 | 1 | 1 | 4 |
| cdevStudios | 26 | 6 | 2 | 7 | 6 | 0 | 0 | 6 | 1 | 2 |
| followLens | 6 | 15 | 0 | 5 | 5 | 1 | 0 | 3 | 1 | 1 |
| novaVolt | 21 | 11 | 0 | 3 | 7 | 0 | 0 | 4 | 1 | 0 |
| cataleya | 22 | 10 | 1 | 4 | 3 | 0 | 0 | 5 | 1 | 0 |
| payFlow | 15 | 9 | 2 | 3 | 8 | 0 | 0 | 6 | 1 | 0 |
| rumbo | 17 | 10 | 0 | 7 | 4 | 0 | 0 | 6 | 1 | 0 |
| desktopCalendar | 13 | 9 | 0 | 12 | 3 | 0 | 0 | 9 | 1 | 0 |
| genius | 16 | 6 | 0 | 2 | 6 | 0 | 0 | 7 | 1 | 0 |
| antiSpamMcp | 31 | 8 | 0 | 2 | 15 | 0 | 0 | 9 | 1 | 0 |
| shopHub | 24 | 6 | 1 | 2 | 10 | 0 | 0 | 9 | 1 | 0 |
| **Total** | **211** | **101** | **7** | **58** | **72** | **1** | **2** | **65** | **11** | **7** |

Hay 535 nodos en total. `group` aparece solo en las tres primeras visuales; las otras ocho expresan el orden mediante el array `elements`. La presencia o ausencia de grupos no limita el renderer: únicamente cambia cómo se organiza la configuración.

## 5. Patrones recurrentes y específicos

### Recurrentes

- **Shell visual:** las once visuales usan el mismo `viewBox`, `1000 620`, y el mismo marco exterior. Diez usan exactamente el divisor horizontal y=126; `privGvard` usa y=145 para dejar más espacio al encabezado.
- **Identidad del proyecto:** las once enlazan el título con `title` y representan las etiquetas con un `textList` enlazado a `tags`. Los títulos varían de 28 a 32 unidades en tamaño y `privGvard` sitúa su baseline en y=116; las otras diez usan y=92.
- **Tecnologías:** cada proyecto tiene un panel lateral con el listado de tags. Diez lo colocan a la izquierda y `followLens` a la derecha. Ancho, alto, `x/y`, tipografía y `gap` dependen de cada visual.
- **Tokens de tema:** no se encontraron paints hexadecimales fijos. Referencias en todas las cadenas de las once definiciones: `--accent-color` 273, `--mantine-color-default-border` 128, `--mantine-color-body` 124, `--mantine-color-text` 95 y `--mantine-color-dimmed` 55. El acento se usa con más frecuencia porque también representa nodos, conectores e indicadores.
- **Degradados:** cada fondo es un `linearGradient` (11). Dentro de los nodos se usan 13 paints `linearGradient` y 8 `radialGradient`. Hay variaciones de stops, opacidades y dirección; por tanto, compartir el tipo no equivale a tener una receta visual única.

### Específicos

- `privGvard`: escudo/candado central conectado a dispositivos y paneles de seguridad.
- `cdevStudios`: tres módulos de aplicación convergen en servicios y microservicios, con almacenamiento PostgreSQL.
- `followLens`: mapa radial de relaciones y serie temporal; es la única configuración que usa `polyline`.
- `novaVolt`: storefront con tres productos pares y transición de carrito a checkout.
- `cataleya`: storefront y backoffice sincronizados, con inventario y actividad.
- `payFlow`: solicitud, núcleo transaccional, validación y persistencia ACID.
- `rumbo`: ruta de transporte y contratos compartidos entre cliente web y Android.
- `desktopCalendar`: única cuadrícula funcional de calendario con eventos y navegación mensual.
- `genius`: tres módulos de negocio conectados a una plataforma.
- `antiSpamMcp`: inbox, motor de reglas, gate MCP, clasificación y aprobación humana antes de la acción.
- `shopHub`: catálogo, carrito, API Express, Prisma y PostgreSQL.

Estos casos están expresados con combinaciones de primitivas comunes, pero su semántica y topología son propias del proyecto. Conviene mantenerlos como datos declarativos específicos.

## 6. Duplicaciones observadas

### Marco exterior: coincidencia literal

Las once definiciones repiten este descriptor:

```js
{
    type: 'rect',
    x: 24,
    y: 24,
    width: 952,
    height: 572,
    rx: 22,
    fill: 'none',
    stroke: 'var(--mantine-color-default-border)',
    strokeWidth: 1,
}
```

Es una repetición exacta con semántica estable. Compartir solo este descriptor reduciría duplicación de datos sin imponer un layout a las escenas internas. El coste es una dependencia/import adicional y tener que preservar su posición al inicio del array de cada escena.

### Divisor del encabezado: coincidencia mayoritaria

Diez configs repiten la línea de x=25 a 975 en y=126, con el token de borde y grosor 1. `privGvard` mantiene la misma línea en y=145. Puede compartirse el valor común si la excepción sigue explícita y no se introduce un booleano o una variante implícita.

### Paneles y tarjetas: repetición de estilo, no de descriptor

Hay 71 `rect` con esquinas redondeadas (`rx >= 10`) y borde estándar. Sus posiciones, dimensiones, radios, paints y papeles varían entre marcos, paneles de interfaz, productos y nodos. Ese recuento no es evidencia suficiente para extraer un `Card` universal: reúne usos visuales distintos bajo una misma forma SVG.

Las listas de tags se repiten exactamente en intención, pero las configuraciones de posición, tamaño y separación son diferentes. `textList` ya abstrae la generación de varios `<text>` desde un binding, por lo que agregar un `TechnologyList` al renderer duplicaría una capacidad existente.

### Fondos

Todas usan un fondo `linearGradient`, pero algunas empiezan en `body` y terminan en mezcla de acento, mientras otras invierten esos stops. La opacidad de acento va de 8% a 12%. No hay una única definición de fondo que pueda sustituirse sin alterar la apariencia.

## 7. Auditoría del schema y renderer

### ¿Qué funciona bien?

- `ProjectDescriptionVisual.jsx` valida un `viewBox` de cuatro números y renderiza arrays de nodos declarativos.
- El renderer soporta `group`, `text`, `textList`, `rect`, `circle`, `ellipse`, `line`, `path`, `polyline` y `polygon`; todos aparecen cubiertos por las visuales revisadas.
- Hay bindings acotados para `title`, `description`, `longDescription` y `tags`. Las configuraciones enlazan `title` y `tags` en las 11 visuales. `description`/`longDescription` se usan para el `<desc>` accesible del SVG, no como elementos gráficos.
- Fondos y paints aceptan gradientes lineales/radiales; IDs de gradiente se generan por instancia para evitar colisiones entre SVG.
- Atributos, paints, coordenadas, opacidades, stops y puntos se filtran antes de renderizar.
- El SVG conserva `preserveAspectRatio="xMidYMid meet"`, dimensiones fluidas y nombres accesibles desde los datos del proyecto.

### ¿Qué se repite demasiado?

El marco exterior exacto en las once definiciones es el único descriptor de escena completamente idéntico con evidencia clara. También se repite el divisor de encabezado en diez. Los paneles de tags siguen un patrón de composición, pero no una geometría estable.

### ¿Qué propiedades provocan duplicación?

Los campos geométricos y de presentación del marco (`x`, `y`, `width`, `height`, `rx`, `fill`, `stroke`, `strokeWidth`) se repiten literalmente. En cambio, `textList` evita duplicar un nodo `text` por cada tag; los paneles internos requieren valores propios por composición.

### ¿Qué primitivas faltan?

Ninguna de las 11 visuales actuales necesita una primitiva que el renderer no soporte. No existe una limitación concreta que justifique cambiar `ProjectDescriptionVisual.jsx` para esta fase.

### ¿Qué primitivas no deberían agregarse ahora?

No agregar un `card`, `database`, `api`, `workflow`, `calendar`, `approval`, `icon` o `architectureNode` semántico al renderer. Sus diferencias actuales se resuelven con primitivas SVG y añadirlas convertiría decisiones de dominio/diseño en una API general sin reutilización suficiente. Tampoco se justifica agregar filtros, imágenes, clip paths o animación: ninguna de las once configuraciones los requiere.

### ¿Hay una limitación concreta que requiera código?

No. Las once escenas se expresan con el schema actual. La extracción del marco repetido, si se aprueba para la siguiente fase, puede realizarse como reutilización de datos en los módulos visuales sin reescribir el renderer ni ampliar la DSL.

## 8. Candidatos a abstracción

### Abstraer en datos compartidos — candidato acotado

**`PROJECT_VISUAL_FRAME`**

- **Propósito:** compartir el `rect` exterior idéntico que delimita cada escena.
- **Frecuencia:** 11 veces.
- **Dónde:** las once definiciones listadas en el inventario.
- **Ventaja:** elimina la única repetición literal de descriptor común en todos los módulos.
- **Costo:** nuevo módulo/import y cuidado con el orden de pintura. No debe mutarse el descriptor compartido.
- **Riesgo:** bajo; puede variar el render si el elemento deja de ser el primer nodo.
- **Decisión:** ✅ considerar extracción en Fase 11 y comparar el resultado visual.

**`PROJECT_VISUAL_HEADER_DIVIDER`**

- **Propósito:** compartir la línea horizontal de encabezado común.
- **Frecuencia:** 10 configuraciones idénticas; una variante vertical en `privGvard`.
- **Ventaja:** reduce otra repetición literal.
- **Costo:** mantener la excepción de y=145 claramente declarada.
- **Riesgo:** bajo/medio si la excepción se oculta en lógica condicional.
- **Decisión:** ⚠️ incluir solo si la extracción del marco se mantiene simple; preferir datos explícitos para la excepción.

### Posiblemente abstraer más adelante

**`TechnologyList`**

- **Propósito:** presentar tecnologías del proyecto.
- **Frecuencia:** 11.
- **Ventaja potencial:** nombre semántico compartido.
- **Costo:** necesita coordenadas, escala, separación, tipografía, color y alineación variables; el renderer ya tiene `textList`.
- **Riesgo:** API más compleja que la configuración actual y duplicación de capacidad.
- **Decisión:** ⚠️ no cambiar en Fase 11 salvo que aparezca un requisito nuevo que `textList` no cubra.

### No abstraer con la evidencia actual

- **Tarjetas/nodos:** aparecen en composiciones de productos, apps, colas, módulos y paneles; mismos primitives no significan mismo componente.
- **`ApiBlock` / `DatabaseBlock`:** 4 bloques rotulados API/servicio y 3 símbolos de base de datos, con geometrías y responsabilidades diferentes. Las primitivas existentes bastan.
- **`WorkflowStep` / `ArchitectureNode`:** los conectores aparecen en 10 escenas, pero varían entre red, ruta, checkout, arquitectura y aprobación.
- **`StorefrontPreview`, `CalendarGrid`, `SecurityFlow`:** patrones específicos o de baja frecuencia, dependientes del proyecto.
- **Factory, clase o DSL alternativa:** no reduce complejidad demostrada y añadiría indirection a datos actualmente legibles.

## 9. Recomendación arquitectónica

Mantener el flujo actual:

```text
datos específicos del proyecto
        ↓
visualData declarativo
        ↓
ProjectDescriptionVisual
        ↓
SVG
```

El renderer debe seguir siendo neutral al dominio y responsable de validar/renderizar primitivas, bindings y paints. Las configuraciones deben conservar la autoría de layout y topología de cada proyecto. La única repetición que podría salir de ellas es el shell literal compartido, como descriptor de datos, sin introducir componentes de layout ni alterar el orden o el `viewBox`.

No se modificaron `ProjectDescriptionVisual.jsx` ni las 11 visuales. Por tanto, no hay comparación visual antes/después necesaria y el diseño permanece sin cambios.

## 10. Propuesta exacta para Fase 11

1. Crear un módulo pequeño de patrones compartidos bajo `src/data/projectVisuals/` que exporte el descriptor inmutable del marco exterior, con un nombre explícito como `PROJECT_VISUAL_FRAME`.
2. Reemplazar en los 11 módulos solo el objeto literal del marco por la referencia compartida, manteniéndolo en la misma posición del array `elements`.
3. Evaluar en el mismo cambio si compartir el divisor de y=126 en diez visuales ahorra duplicación suficiente; mantener la línea de y=145 de `privGvard` como dato explícito, sin flags ni factories.
4. No tocar `ProjectDescriptionVisual.jsx`, modal, `projects.js`, contenido de proyectos, traducciones o estilos.
5. Validar lint/build y renderizar las once escenas para comparar sus capturas antes/después en desktop y tamaño móvil. Si el diff no es estrictamente visualmente neutro, revertir la extracción.

La Fase 11 debe cerrar con una decisión sobre el divisor. No debe incluir `TechnologyList`, API/database blocks, nodos, cards ni refactor del renderer sin nueva evidencia o un requisito que lo necesite.
