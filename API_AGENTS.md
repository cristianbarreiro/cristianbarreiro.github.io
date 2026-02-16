# API_AGENTS.md — Dominio de Servicios y Capa de Datos

> Archivo de gobernanza para agentes que operan sobre la capa de datos, servicios externos e integración API.  
> Leer `AGENTS.md` antes de este archivo.

---

## 1. Responsabilidad Principal

El dominio API gestiona toda la lógica de datos y comunicación con servicios externos:

- Archivos de datos estáticos (`src/data/`)
- Configuración del sitio (`src/config/siteConfig.js`)
- Capa de servicios futura (`src/services/` — cuando exista)
- Integración con EmailJS (actual)
- Integración con APIs externas (futuro)

---

## 2. Estado Actual

> **IMPORTANTE:** Este proyecto actualmente es un sitio estático. No hay servidor backend.  
> Los datos son archivos `.js` que exportan funciones puras. Las "APIs" son llamadas  
> client-side a servicios como EmailJS.

### Archivos bajo este dominio (activos)

| Archivo                      | Contenido                                          |
|------------------------------|----------------------------------------------------|
| `src/data/projects.js`       | Lista de proyectos por idioma + funciones de acceso |
| `src/data/skills.js`         | Lista de habilidades técnicas                      |
| `src/data/skills.i18n.js`    | Traducciones de categorías de skills               |
| `src/data/experience.js`     | Experiencia laboral                                |
| `src/data/experience.i18n.js`| Traducciones de experiencia                        |
| `src/config/siteConfig.js`   | Configuración global del sitio                     |

---

## 3. Qué Puede Modificar

| Recurso                       | Acción permitida                                     |
|-------------------------------|------------------------------------------------------|
| `src/data/*.js`               | Crear, editar archivos de datos                      |
| `src/data/*.i18n.js`          | Crear, editar traducciones de datos                  |
| `src/config/siteConfig.js`    | Editar con aprobación del owner                      |
| `src/services/*.js` (futuro)  | Crear, editar capa de servicios                      |

---

## 4. Qué NO Puede Modificar

| Recurso                       | Motivo                                               |
|-------------------------------|------------------------------------------------------|
| `src/components/*.jsx`        | Pertenece al dominio UI                              |
| `src/pages/*.jsx`             | Pertenece al dominio UI                              |
| `src/styles/*.css`            | Pertenece al dominio UI                              |
| `public/locales/*.json`       | Pertenece al dominio UI (i18n)                       |
| `src/utils/storage.js`        | Infraestructura compartida                           |
| `src/i18n.js`                 | Infraestructura compartida                           |
| `src/main.jsx`                | Entry point protegido                                |

---

## 5. Contratos de Entrada/Salida

### 5.1 Datos → UI (Contrato Activo)

Cada archivo de datos **debe** exportar:

```javascript
// Función principal con soporte i18n
export const getItems = (language = 'es') => {
    const lang = (language || 'es').split('-')[0];
    return itemsByLanguage[lang] || itemsByLanguage.es;
};

// Export por defecto en español para compatibilidad
export const items = getItems('es');
```

**Estructura de datos obligatoria:**

```javascript
const itemsByLanguage = {
    es: [ /* Array de objetos */ ],
    en: [ /* Array de objetos con la misma estructura */ ],
};
```

**Reglas:**
- Cada objeto debe tener un campo `id` único.
- Las mismas claves en ES y EN (solo cambian los valores traducibles).
- Funciones de utilidad (filtros, getters) al final del archivo.
- No importar dependencias externas en archivos de datos.

### 5.2 Datos: Estructura de Proyecto

```javascript
{
    id: Number,              // Único, secuencial
    title: String,           // Nombre del proyecto
    description: String,     // Descripción corta (1-2 líneas)
    longDescription: String, // Descripción detallada
    image: String | null,    // URL de imagen o null
    tags: String[],          // Array de tecnologías
    demoUrl: String,         // URL de demo ('' o '#' si no hay)
    repoUrl: String,         // URL de repositorio ('' si es privado)
    featured: Boolean        // Destacado en la vista principal
}
```

### 5.3 Configuración: siteConfig

```javascript
{
    name: String,           // Nombre corto / logo text
    fullName: String,       // Nombre completo
    title: String,          // Título profesional
    subtitle: String,       // Subtítulo
    email: String,          // Email de contacto
    heroDescription: String,// Descripción para hero section
    bio: String,            // Biografía detallada
    interests: String[],    // Lista de intereses
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        portfolio: String
    },
    primaryColor: String,   // Color primario de Mantine
    copyrightYear: Number   // Año de copyright
}
```

### 5.4 Futuro: API → UI (cuando exista backend)

```javascript
// src/services/api.js

/**
 * Formato estándar de respuesta API
 * Ver skills/skills.md → Skill: API Response Format
 */
const apiResponse = {
    success: Boolean,
    data: Object | Array | null,
    error: {
        code: String,
        message: String,
        details: Object | null
    } | null,
    meta: {
        timestamp: String,
        requestId: String
    }
};
```

### 5.5 Futuro: API → AUTH

```
Header:        Authorization: Bearer <token>
Validación:    Middleware antes de acceder a rutas protegidas
Flujo:         API recibe token → AUTH valida → API responde
Responsable:   AUTH genera/revoca tokens; API solo los consume
```

---

## 6. Reglas Técnicas Específicas

### 6.1 Archivos de Datos

- Funciones puras — sin side effects, sin `fetch`, sin `localStorage`.
- Exports nombrados + export por defecto para compatibilidad.
- Documentar la estructura de cada objeto con JSDoc al inicio del archivo.
- Fallback a `'es'` siempre.
- Normalizar el parámetro `language`: `(language || 'es').split('-')[0]`.

### 6.2 EmailJS (Servicio Actual)

- La integración con EmailJS está encapsulada en `src/pages/Contact.jsx`.
- Solo usa claves públicas del lado del cliente.
- No almacena datos sensibles.
- Manejo de errores con feedback visual al usuario.

### 6.3 Capa de Servicios Futura

Cuando se necesite un backend:

```
src/services/
├── api.js          # Cliente HTTP base (fetch wrapper)
├── projects.js     # Servicio de proyectos
├── auth.js         # Servicio de autenticación (coordinar con AUTH)
└── index.js        # Re-exports centralizados
```

**Reglas para `src/services/`:**
- Cada servicio es un módulo independiente.
- Usar `fetch` nativo (no axios u otros HTTP clients sin aprobación).
- Manejo de errores con patrón `ApiResponse` (ver `skills/skills.md`).
- Nunca exponer tokens o credenciales en el código.
- Toda llamada debe tener timeout y retry configurable.

### 6.4 Validación de Datos

- Validar inputs antes de procesarlos.
- Sanitizar datos que vienen del usuario (formularios).
- No confiar en datos del cliente para lógica de negocio.

---

## 7. Criterios de Calidad

| Criterio                   | Estándar                                            |
|----------------------------|-----------------------------------------------------|
| Consistencia de estructura | Mismas claves en ES y EN; IDs únicos                |
| Funciones puras            | Sin side effects en archivos de datos                |
| Documentación              | JSDoc en toda función exportada                      |
| Manejo de errores          | Patrón ApiResponse para servicios (ver skills.md)    |
| Sin dependencias innecesarias | Archivos de datos: 0 imports externos             |
| Compatibilidad             | Export nombrado + default para cada dataset          |

---

## 8. Checklist de Tarea Completa

Antes de considerar una tarea de datos/API como terminada:

- [ ] La función exportada recibe `language` y hace fallback a `'es'`.
- [ ] Los datos existen en ambos idiomas (ES + EN) con la misma estructura.
- [ ] Cada objeto tiene un `id` único.
- [ ] No hay imports de dependencias externas en archivos de datos.
- [ ] JSDoc documentando la estructura del objeto al inicio del archivo.
- [ ] Funciones de utilidad (filtros, getters) exportadas y documentadas.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npm run build` compila sin errores.
- [ ] Si se creó un nuevo archivo de datos, el dominio UI fue notificado.
- [ ] Si se modificó la estructura de un objeto, verificar que la UI no se rompe.
- [ ] No hay `console.log` residuales.
- [ ] El cambio es atómico y reversible.

---

## 9. Dependencias Cruzadas

| Si la tarea involucra…           | Coordinar con…     | Acción                                         |
|----------------------------------|--------------------|-------------------------------------------------|
| Nueva estructura de datos        | Dominio UI         | Notificar para adaptar renderizado               |
| Cambios en siteConfig            | Owner + UI         | Aprobación del owner; UI adapta si es necesario  |
| Servicio externo nuevo           | Owner + AGENTS.md  | Aprobación; documentar en §5.5 de AGENTS.md     |
| Capa de autenticación en API     | Dominio AUTH       | AUTH define tokens; API los consume              |
| Cambios en formato de respuesta  | Dominio UI         | UI debe adaptarse al nuevo formato               |

---

*Última actualización: 2026-02-16*
