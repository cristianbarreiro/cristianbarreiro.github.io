# AGENTS.md — Orquestación de Agentes IA

> Archivo raíz de gobernanza para el portfolio de Cristian Barreiro.  
> Todos los agentes (humanos e IA) deben leer este archivo antes de realizar cualquier modificación.

---

## 🔒 Sección Bloqueada (No Modificar Automáticamente)

> **ADVERTENCIA:** Esta sección NO puede ser editada por agentes automatizados.  
> Solo el propietario del repositorio puede modificar estos valores.

- **Propietario:** Cristian Barreiro  
- **Idioma primario:** Español (ES), con soporte en Inglés (EN)  
- **Licencia:** Portfolio personal — Todos los derechos reservados  
- **Contacto:** cristianbarreirofag@gmail.com  

---

## 1. Filosofía de Colaboración Humano + IA

Este repositorio opera bajo un modelo de **co-autoría supervisada**:

- La IA propone, el humano aprueba.
- Cada cambio debe ser atómico, reversible y explicable.
- La IA no toma decisiones de producto — solo decisiones de implementación dentro de los límites definidos.
- Ante ambigüedad, el agente debe **preguntar**, nunca asumir.
- El contexto siempre es más importante que la velocidad.

---

## 2. Reglas Globales del Proyecto

### 2.1 Stack Tecnológico

| Capa           | Tecnología                                    |
|----------------|-----------------------------------------------|
| Framework      | React 19 + Vite 7                             |
| UI Library     | Mantine 8                                     |
| Routing        | React Router DOM 7                            |
| i18n           | i18next + react-i18next                       |
| Icons          | @tabler/icons-react                           |
| Contact Form   | EmailJS (client-side)                         |
| Deployment     | GitHub Pages (`gh-pages`)                     |
| Node           | ESM (`"type": "module"`)                      |

### 2.2 Reglas Universales

1. **No hay backend activo.** Este es un sitio estático desplegado en GitHub Pages. No introducir lógica server-side.
2. **i18n obligatorio.** Todo texto visible al usuario debe soportar ES/EN vía i18next. Actualizar `public/locales/es.json` y `public/locales/en.json`.
3. **Datos centralizados.** El contenido vive en `src/data/` y `src/config/siteConfig.js`. No hardcodear texto en componentes.
4. **Mantine primero.** Preferir componentes de Mantine sobre CSS custom. CSS custom solo cuando Mantine no cubra el caso.
5. **Dependencias mínimas.** No agregar paquetes sin justificación. Evaluar si la funcionalidad se puede lograr con lo existente.
6. **Lint obligatorio.** Ejecutar `npm run lint` y corregir errores antes de proponer cambios.
7. **Accesibilidad.** HTML semántico, ARIA labels, contraste de color adecuado.
8. **Naming conventions.** Componentes en PascalCase, utilidades en camelCase, archivos de datos en camelCase.
9. **Sin secrets.** Nunca incluir claves API, tokens o credenciales en el código. EmailJS usa claves públicas configuradas en el cliente.

### 2.3 Estructura de Directorios

```
src/
├── components/    # Componentes reutilizables de UI
├── pages/         # Componentes a nivel de ruta
├── data/          # Datos estáticos (proyectos, skills, experiencia)
├── config/        # Configuración global (siteConfig.js)
├── styles/        # CSS global
├── utils/         # Funciones helper (storage, colorScheme)
├── i18n.js        # Inicialización de i18next
├── App.jsx        # Definición de rutas
└── main.jsx       # Entry point con MantineProvider

public/
├── locales/       # Archivos de traducción JSON (en.json, es.json)
└── videos/        # Assets de video estáticos
```

---

## 3. Estándares de Calidad

### 3.1 Código

- Funciones puras siempre que sea posible.
- Componentes pequeños y con responsabilidad única.
- Props documentadas con JSDoc o comentarios inline.
- No dejar `console.log` en producción (usar solo en desarrollo).
- Imports ordenados: bibliotecas externas → componentes locales → utils → estilos.

### 3.2 Commits

- Mensajes en inglés, formato: `type(scope): description`.
- Tipos: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test`.
- Ejemplo: `feat(projects): add e-commerce project card`.

### 3.3 Performance

- Lazy loading para rutas cuando el proyecto crezca.
- Imágenes optimizadas (WebP preferido, con fallback).
- No bloquear el hilo principal con cómputo pesado.

---

## 4. Comportamiento de Agentes

### 4.1 Antes de Cualquier Cambio

1. Leer este archivo (`AGENTS.md`).
2. Leer el archivo de dominio correspondiente (`UI_AGENTS.md`, `API_AGENTS.md`, `AUTH_AGENTS.md`).
3. Leer `skills/skills.md` si la tarea involucra patrones reutilizables.
4. Verificar que la tarea está dentro del scope permitido.

### 4.2 Durante la Ejecución

- Un cambio por commit lógico.
- Si el cambio afecta más de un dominio, documentar la dependencia cruzada.
- Si se necesita un paquete nuevo, justificar con: *por qué*, *alternativas evaluadas*, *tamaño del bundle*.
- No refactorizar código ajeno a la tarea actual sin aprobación explícita.

### 4.3 Después del Cambio

- Ejecutar `npm run lint`.
- Verificar que el build pasa: `npm run build`.
- Validar traducciones en ambos idiomas.
- Documentar cualquier decisión no obvia en comentarios de código.

---

## 5. Contratos de Entrada/Salida entre Dominios

### 5.1 UI → Datos

| Aspecto       | Contrato                                                                 |
|---------------|--------------------------------------------------------------------------|
| **Entrada**   | Funciones exportadas desde `src/data/*.js` (ej: `getProjects(lang)`)     |
| **Formato**   | Arrays de objetos con estructura documentada en cada archivo de datos    |
| **Idioma**    | El parámetro `language` determina el idioma; fallback siempre a `'es'`   |
| **Salida UI** | Componentes renderizan datos sin transformarlos; la lógica vive en data  |

### 5.2 UI → Configuración

| Aspecto       | Contrato                                                          |
|---------------|-------------------------------------------------------------------|
| **Fuente**    | `src/config/siteConfig.js`                                        |
| **Acceso**    | Import directo: `import { siteConfig } from '../config/siteConfig'` |
| **Mutación**  | Prohibida en runtime. Solo editable en el archivo fuente          |

### 5.3 UI → i18n

| Aspecto        | Contrato                                                        |
|----------------|------------------------------------------------------------------|
| **Claves**     | Definidas en `public/locales/{lang}.json`                        |
| **Acceso**     | `useTranslation()` hook → `t('clave.subclave')`                 |
| **Nuevas claves** | Agregar en ambos archivos (`es.json` + `en.json`) simultáneamente |
| **Fallback**   | `es` es el idioma de respaldo                                    |

### 5.4 UI → Persistencia (localStorage / Cookies)

| Aspecto      | Contrato                                                            |
|--------------|---------------------------------------------------------------------|
| **Acceso**   | Solo a través de `src/utils/storage.js`                             |
| **Directo**  | Prohibido usar `localStorage` o `document.cookie` directamente      |
| **Claves**   | `lang` (idioma), `mantine-color-scheme-value` (tema)                |

### 5.5 UI → Servicios Externos

| Aspecto      | Contrato                                                             |
|--------------|----------------------------------------------------------------------|
| **EmailJS**  | Solo desde el componente `Contact.jsx`                               |
| **APIs**     | Toda llamada externa debe usar `fetch` con manejo de errores         |
| **Sin CORS** | No configurar proxies; el sitio es estático                          |

### 5.6 Futuro: UI → API (cuando exista backend)

| Aspecto        | Contrato                                                          |
|----------------|-------------------------------------------------------------------|
| **Capa**       | Crear `src/services/` para centralizar llamadas API               |
| **Formato**    | Request/Response en JSON                                          |
| **Errores**    | Usar el patrón `ApiResponse` definido en `skills/skills.md`       |
| **Auth**       | Tokens gestionados por el dominio AUTH, nunca por UI directamente  |

### 5.7 Futuro: API → AUTH

| Aspecto        | Contrato                                                          |
|----------------|-------------------------------------------------------------------|
| **Verificación** | Toda ruta protegida valida token vía middleware                 |
| **Formato token**| Bearer token en header `Authorization`                          |
| **Expiración** | Definida por AUTH; API solo valida, no genera tokens               |

---

## 6. Scope Control — Qué NO Está Permitido

### 6.1 Prohibiciones Absolutas

- ❌ Agregar un backend, servidor o base de datos sin aprobación del owner.
- ❌ Modificar la sección bloqueada de este archivo.
- ❌ Eliminar soporte i18n de cualquier componente existente.
- ❌ Introducir TypeScript en el proyecto actual (el proyecto es JSX puro por decisión).
- ❌ Cambiar el sistema de build (Vite) o el framework (React).
- ❌ Modificar `package.json` sin justificación documentada.
- ❌ Desplegar a un proveedor diferente a GitHub Pages sin aprobación.
- ❌ Usar `!important` en CSS salvo caso extremo documentado.
- ❌ Commitear archivos `.env`, claves o tokens.

### 6.2 Requiere Aprobación Explícita

- ⚠️ Agregar una nueva dependencia npm.
- ⚠️ Crear una nueva ruta/página.
- ⚠️ Modificar la estructura de directorios.
- ⚠️ Cambiar la paleta de colores o el primaryColor.
- ⚠️ Integrar un servicio externo nuevo.
- ⚠️ Refactorizaciones que afecten más de 3 archivos.

---

## 7. Archivos de Dominio

| Dominio | Archivo           | Responsabilidad                            |
|---------|-------------------|--------------------------------------------|
| UI      | `UI_AGENTS.md`    | Componentes, páginas, estilos, i18n        |
| API     | `API_AGENTS.md`   | Servicios, llamadas externas, capa de datos |
| AUTH    | `AUTH_AGENTS.md`  | Autenticación, tokens, guards              |
| Skills  | `skills/skills.md`| Patrones reutilizables entre dominios      |

Cada agente debe leer su archivo de dominio correspondiente antes de actuar.

---

## 8. Escalabilidad

Este sistema de agentes está diseñado para crecer. Cuando el proyecto lo requiera:

1. **Nuevos dominios** → Crear `{DOMINIO}_AGENTS.md` en la raíz.
2. **Nuevos skills** → Agregar al archivo `skills/skills.md` siguiendo el formato existente.
3. **Sub-agentes** → Si un dominio crece, puede tener su propio directorio `agents/` con archivos especializados.
4. **Testing** → Cuando se agreguen tests, crear `TEST_AGENTS.md` con reglas específicas.

---

*Última actualización: 2026-02-16*
