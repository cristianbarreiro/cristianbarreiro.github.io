# AGENTS.md — Gobernanza de Agentes IA

> Archivo raíz de gobernanza para el portfolio de Cristian Barreiro.  
> Todo agente (humano o IA) **debe leer este archivo antes de realizar cualquier modificación.**

---

## 🔒 Sección Bloqueada

> **ADVERTENCIA:** Esta sección NO puede ser editada por agentes automatizados.  
> Solo el propietario del repositorio puede modificar estos valores.

- **Propietario:** Cristian Barreiro  
- **Idioma primario:** Español (ES), con soporte en Inglés (EN)  
- **Licencia:** Portfolio personal — Todos los derechos reservados  
- **Contacto:** <cristianbarreirofag@gmail.com>  

---

## 1. Filosofía de Colaboración

Este repositorio opera bajo un modelo de **co-autoría supervisada**:

1. La IA propone, el humano aprueba.
2. Cada cambio debe ser atómico, reversible y explicable.
3. La IA toma decisiones de **implementación**, nunca de **producto**.
4. Ante ambigüedad, **preguntar**. Nunca asumir.
5. Si el usuario elimina código, **no re-introducirlo**. Consultar antes si se cree indispensable.
6. El contexto siempre es más importante que la velocidad.

---

## 2. Stack Tecnológico

| Capa           | Tecnología                                |
|----------------|-------------------------------------------|
| Framework      | React 19 + Vite 7                         |
| UI Library     | Mantine 8                                 |
| Routing        | React Router DOM 7                        |
| i18n           | i18next + react-i18next                   |
| Icons          | @tabler/icons-react                       |
| Animations     | Framer Motion                             |
| 3D             | Three.js + @react-three/fiber + drei      |
| Contact Form   | EmailJS (client-side)                     |
| Deployment     | GitHub Pages (`gh-pages`)                 |
| Node           | ESM (`"type": "module"`)                  |

---

## 3. Reglas Universales

1. **Sin backend.** Sitio estático en GitHub Pages. No introducir lógica server-side.
2. **i18n obligatorio.** Todo texto visible debe existir en `public/locales/es.json` y `en.json`. Usar `useTranslation()` → `t('clave')`.
3. **Datos centralizados.** Contenido en `src/data/` y `src/config/siteConfig.js`. No hardcodear texto en componentes.
4. **Mantine primero.** Preferir componentes Mantine sobre CSS custom. CSS custom solo cuando Mantine no cubra el caso.
5. **Dependencias mínimas.** No agregar paquetes sin justificación (por qué, alternativas evaluadas, impacto en bundle).
6. **Lint obligatorio.** Ejecutar `npm run lint` y corregir errores antes de proponer cambios. No ejecutar `npm run build` como paso automático en cada cambio.
7. **Accesibilidad.** HTML semántico, ARIA labels, contraste adecuado.
8. **Naming conventions.** Componentes en PascalCase, utilidades en camelCase, archivos de datos en camelCase.
9. **Sin secrets.** No incluir claves API, tokens ni credenciales. EmailJS usa claves públicas.

---

## 4. Estructura de Directorios

```
src/
├── assets/        # Imágenes, SVGs y assets estáticos
├── components/    # Componentes reutilizables de UI
├── config/        # Configuración global (siteConfig.js)
├── context/       # Contextos de React (ThemeContext)
├── data/          # Datos estáticos (proyectos, skills, experiencia)
├── pages/         # Componentes a nivel de ruta
├── styles/        # CSS global
├── utils/         # Funciones helper (storage, colorSchemeManager)
├── i18n.js        # Inicialización de i18next
├── App.jsx        # Definición de rutas
└── main.jsx       # Entry point (ThemeProvider → ThemeRoot → MantineProvider)

public/
├── locales/       # Archivos de traducción JSON (en.json, es.json)
└── videos/        # Assets de video estáticos
```

---

## 5. Estándares de Calidad

### 5.1 Código

- Funciones puras siempre que sea posible.
- Componentes pequeños con responsabilidad única.
- Props documentadas con JSDoc o comentarios inline.
- No dejar `console.log` en producción.
- Orden de imports: bibliotecas externas → componentes → utils → estilos.

### 5.2 Commits

- Mensajes en inglés: `type(scope): description`.
- Tipos válidos: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test`.
- Ejemplo: `feat(projects): add e-commerce project card`.

### 5.3 Performance

- Lazy loading para rutas cuando el proyecto crezca.
- Imágenes optimizadas (WebP preferido, con fallback).
- No bloquear el hilo principal con cómputo pesado.

---

## 6. Comportamiento de Agentes

### 6.1 Antes de Cualquier Cambio

1. Leer este archivo (`AGENTS.md`).
2. Leer el archivo de dominio correspondiente (§9).
3. Leer `skills/skills.md` si la tarea involucra patrones reutilizables.
4. Verificar que la tarea está dentro del scope permitido (§7).

### 6.2 Durante la Ejecución

- Un cambio por commit lógico.
- Si el cambio cruza dominios, documentar la dependencia.
- No refactorizar código ajeno a la tarea sin aprobación explícita.

### 6.3 Después del Cambio

- Ejecutar `npm run lint`.
- **No desplegar** (`npm run deploy`) salvo solicitud explícita del usuario.
- Ejecutar `npm run build` solo si es necesario para validar un cambio puntual.
- Validar traducciones en ambos idiomas.
- Documentar decisiones no obvias en comentarios de código.

---

## 7. Scope Control y Niveles de Autorización

### 7.1 Matriz de Operaciones

Toda acción propuesta o ejecutada por un agente se clasifica estrictamente en uno de los siguientes niveles:

#### Nivel 1: Acciones Autónomas (Permitidas dentro del scope asignado)
- Modificar componentes, páginas o utilidades existentes relacionadas directamente con la tarea.
- Arreglar errores de linting (`npm run lint`) y fallos de sintaxis.
- Agregar o corregir claves i18n sincronizadas en `es.json` y `en.json`.
- Crear componentes secundarios internos si la solución lo exige dentro de la carpeta correspondiente.

#### Nivel 2: Requiere Aprobación Explícita del Usuario
Antes de ejecutar cualquiera de estas acciones, el agente DEBE detenerse, presentar la justificación (motivo, alternativas e impacto) y esperar la confirmación afirmativa del usuario:
- ⚠️ Agregar una nueva dependencia npm (`package.json`).
- ⚠️ Crear una nueva ruta principal en la aplicación (`App.jsx`).
- ⚠️ Modificar la estructura global de directorios o mover archivos clave.
- ⚠️ Modificar la paleta de colores global o el `primaryColor`.
- ⚠️ Integrar un nuevo servicio externo (APIs, SDKs).
- ⚠️ Refactorizaciones destructivas o masivas que afecten más de 3 archivos simultáneamente.
- ⚠️ Cualquier modificación a archivos de configuración de build, CI/CD o linters (`vite.config.js`, `eslint.config.js`, `.github/`).

#### Nivel 3: Prohibiciones Absolutas (Sin excepciones)
- ❌ Agregar backend, servidor, servicios serverless o base de datos sin aprobación explícita del owner.
- ❌ Editar la Sección Bloqueada de `AGENTS.md` o alterar las reglas de gobernanza sin orden directa.
- ❌ Eliminar el soporte i18n o reemplazar textos traducibles por cadenas hardcodeadas.
- ❌ Introducir TypeScript (el repositorio es JSX puro).
- ❌ Cambiar el framework (`React`) o el empaquetador (`Vite`).
- ❌ Commitear o hardcodear archivos `.env`, tokens o claves privadas.
- ❌ Ejecutar comandos Git destructivos (`git reset --hard`, `git clean -fd`, `git push --force`).
- ❌ Desplegar a producción (`npm run deploy`) sin solicitud explícita del usuario.
- ❌ Re-introducir código, funciones o dependencias que el usuario haya eliminado previamente.
- ❌ Usar `!important` en CSS salvo caso extremo explícitamente documentado y aprobado.

### 7.2 Protocolo ante Ambigüedad o Casos No Catalogados
Si una acción no está explícitamente listada en los Niveles 1, 2 o 3 pero altera la arquitectura, el comportamiento de usuario o el flujo de trabajo:
1. El agente **NO debe asumir** ni ejecutar la acción por omisión.
2. Debe clasificar la acción preventivamente como **Nivel 2** (requiere aprobación).
3. Debe formular una consulta clara al usuario exponiendo la necesidad y las opciones disponibles.

---

## 8. Contratos entre Dominios

### 8.1 UI → Datos

| Aspecto       | Contrato                                                              |
|---------------|-----------------------------------------------------------------------|
| **Entrada**   | Funciones exportadas desde `src/data/*.js` (ej: `getProjects(lang)`)  |
| **Formato**   | Arrays de objetos con estructura documentada en cada archivo          |
| **Idioma**    | Parámetro `language` determina el idioma; fallback a `'es'`           |
| **Salida UI** | Componentes renderizan datos sin transformarlos; la lógica vive en data|

### 8.2 UI → Configuración

| Aspecto       | Contrato                                                              |
|---------------|-----------------------------------------------------------------------|
| **Fuente**    | `src/config/siteConfig.js`                                            |
| **Acceso**    | `import { siteConfig } from '../config/siteConfig'`                   |
| **Mutación**  | Prohibida en runtime. Solo editable en el archivo fuente              |

### 8.3 UI → i18n

| Aspecto           | Contrato                                                          |
|-------------------|-------------------------------------------------------------------|
| **Claves**        | Definidas en `public/locales/{lang}.json`                         |
| **Acceso**        | `useTranslation()` → `t('clave.subclave')`                       |
| **Nuevas claves** | Agregar en `es.json` + `en.json` simultáneamente                  |
| **Fallback**      | `es` es el idioma de respaldo                                     |

### 8.4 UI → Persistencia

| Aspecto      | Contrato                                                              |
|--------------|-----------------------------------------------------------------------|
| **Acceso**   | Solo a través de `src/utils/storage.js`                               |
| **Directo**  | Prohibido usar `localStorage` o `document.cookie` directamente        |
| **Claves**   | `lang` (idioma), `mantine-color-scheme-value` (tema), `site-primary-color` (color de acento) |

### 8.5 UI → Servicios Externos

| Aspecto      | Contrato                                                              |
|--------------|-----------------------------------------------------------------------|
| **EmailJS**  | Solo desde el componente `Contact.jsx`                                |
| **APIs**     | Toda llamada externa usa `fetch` con manejo de errores                |
| **Sin CORS** | No configurar proxies; el sitio es estático                           |

### 8.6 Futuro: UI → API (cuando exista backend)

| Aspecto      | Contrato                                                              |
|--------------|-----------------------------------------------------------------------|
| **Capa**     | Crear `src/services/` para centralizar llamadas API                   |
| **Formato**  | Request/Response en JSON                                              |
| **Errores**  | Patrón `ApiResponse` de `skills/skills.md`                            |
| **Auth**     | Tokens gestionados por AUTH, nunca por UI directamente                |

### 8.7 Futuro: API → AUTH

| Aspecto          | Contrato                                                          |
|------------------|-------------------------------------------------------------------|
| **Verificación** | Toda ruta protegida valida token vía middleware                   |
| **Formato**      | Bearer token en header `Authorization`                            |
| **Expiración**   | Definida por AUTH; API solo valida, no genera tokens              |

---

## 9. Archivos de Dominio

| Dominio | Archivo            | Responsabilidad                             |
|---------|--------------------|---------------------------------------------|
| UI      | `UI_AGENTS.md`     | Componentes, páginas, estilos, i18n         |
| API     | `API_AGENTS.md`    | Servicios, llamadas externas, capa de datos |
| AUTH    | `AUTH_AGENTS.md`   | Autenticación, tokens, guards               |
| Skills  | `skills/skills.md` | Patrones reutilizables entre dominios       |

Cada agente debe leer su archivo de dominio correspondiente antes de actuar.

---

## 10. Escalabilidad

Cuando el proyecto lo requiera:

1. **Nuevos dominios** → Crear `{DOMINIO}_AGENTS.md` en la raíz.
2. **Nuevos skills** → Agregar a `skills/skills.md` siguiendo el formato existente.
3. **Sub-agentes** → Si un dominio crece, crear directorio `agents/` con archivos especializados.
4. **Testing** → Crear `TEST_AGENTS.md` con reglas específicas.

---

*Última actualización: 2026-08-14*
