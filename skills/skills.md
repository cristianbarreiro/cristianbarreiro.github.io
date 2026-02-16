# skills.md — Patrones Reutilizables entre Dominios

> Biblioteca de skills (patrones de implementación) compartidos por todos los dominios.  
> Los agentes deben consultar este archivo antes de implementar funcionalidad que coincida con un skill existente.

---

## Índice de Skills

| #  | Skill                  | Dominios que lo usan     |
|----|------------------------|--------------------------|
| 1  | Error Handling         | API, AUTH, UI            |
| 2  | API Response Format    | API, AUTH                |
| 3  | Form Validation        | UI, AUTH                 |
| 4  | Auth Guard             | AUTH, UI                 |
| 5  | Logging Pattern        | API, AUTH, UI            |
| 6  | Data Fetcher           | API, UI                  |
| 7  | i18n Key Convention    | UI, API, AUTH            |
| 8  | Safe Storage Access    | UI, AUTH                 |

---

## Skill 1: Error Handling

### Propósito

Manejo consistente de errores en toda la aplicación. Evita que errores no controlados rompan la experiencia del usuario.

### Cuándo Usarla

- Al hacer llamadas a APIs externas.
- En formularios que envían datos.
- En cualquier operación asíncrona.
- Al acceder a localStorage/cookies.

### Ejemplo Práctico

```javascript
/**
 * Wrapper para operaciones asíncronas con manejo de errores estándar.
 * @param {Function} operation - Función asíncrona a ejecutar.
 * @param {Object} options - Opciones de configuración.
 * @param {string} options.context - Contexto para el mensaje de error.
 * @param {Function} options.onError - Callback personalizado de error.
 * @param {*} options.fallback - Valor por defecto si falla.
 * @returns {Promise<{success: boolean, data: *, error: *}>}
 */
export async function safeAsync(operation, options = {}) {
    const { context = 'operation', onError, fallback = null } = options;

    try {
        const data = await operation();
        return { success: true, data, error: null };
    } catch (error) {
        const normalizedError = {
            code: error.code || 'UNKNOWN_ERROR',
            message: error.message || `Error in ${context}`,
            context,
            timestamp: new Date().toISOString(),
        };

        if (onError) onError(normalizedError);

        // Solo en desarrollo
        if (import.meta.env.DEV) {
            console.error(`[${context}]`, normalizedError);
        }

        return { success: false, data: fallback, error: normalizedError };
    }
}
```

### Anti-Patrón

```javascript
// ❌ INCORRECTO — try/catch vacío que oculta errores
try {
    const data = await fetchData();
} catch (e) {
    // silencio
}

// ❌ INCORRECTO — console.log en producción
try {
    const data = await fetchData();
} catch (e) {
    console.log(e); // Se filtra a producción
}

// ❌ INCORRECTO — error no normalizado
try {
    await sendEmail();
} catch (e) {
    setError(e.toString()); // Expone stack trace al usuario
}
```

---

## Skill 2: API Response Format

### Propósito

Formato estándar de respuesta para toda comunicación entre capas. Garantiza que UI siempre sabe qué forma tienen los datos.

### Cuándo Usarla

- En toda función de `src/services/` (futuro).
- Al envolver respuestas de fetch.
- Al devolver resultados de operaciones de auth.

### Ejemplo Práctico

```javascript
/**
 * Crea una respuesta exitosa estándar.
 * @param {*} data - Datos de la respuesta.
 * @param {Object} meta - Metadata adicional.
 * @returns {ApiResponse}
 */
export function successResponse(data, meta = {}) {
    return {
        success: true,
        data,
        error: null,
        meta: {
            timestamp: new Date().toISOString(),
            ...meta,
        },
    };
}

/**
 * Crea una respuesta de error estándar.
 * @param {string} code - Código de error (ej: 'NOT_FOUND').
 * @param {string} message - Mensaje descriptivo.
 * @param {Object} details - Detalles adicionales.
 * @returns {ApiResponse}
 */
export function errorResponse(code, message, details = null) {
    return {
        success: false,
        data: null,
        error: {
            code,
            message,
            details,
        },
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
}

// Uso:
const result = await fetchProjects();
if (result.success) {
    setProjects(result.data);
} else {
    showNotification({ message: t(`errors.${result.error.code}`) });
}
```

### Anti-Patrón

```javascript
// ❌ INCORRECTO — respuestas inconsistentes
// A veces devuelve array, a veces objeto, a veces string
async function getUser(id) {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) return 'error';     // String
    return await res.json();          // Object
}

// ❌ INCORRECTO — mezclar lógica de UI con respuesta
async function getUser(id) {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) {
        alert('Error!'); // Lógica de UI en capa de datos
        return null;
    }
    return await res.json();
}
```

---

## Skill 3: Form Validation

### Propósito

Validación de formularios consistente y accesible. Garantiza que los datos del usuario se validen antes de procesarlos.

### Cuándo Usarla

- En formularios de contacto (`Contact.jsx`).
- En formularios de login/registro (futuro).
- En cualquier input que acepte datos del usuario.

### Ejemplo Práctico

```javascript
/**
 * Reglas de validación reutilizables.
 * Cada regla recibe un valor y devuelve un mensaje de error o null.
 */
export const validators = {
    required: (value) =>
        !value || (typeof value === 'string' && !value.trim())
            ? 'validation.required'
            : null,

    email: (value) =>
        value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? 'validation.invalidEmail'
            : null,

    minLength: (min) => (value) =>
        value && value.length < min
            ? 'validation.minLength'
            : null,

    maxLength: (max) => (value) =>
        value && value.length > max
            ? 'validation.maxLength'
            : null,
};

/**
 * Valida un objeto contra un esquema de validación.
 * @param {Object} values - Valores del formulario.
 * @param {Object} schema - { campo: [validador, validador, ...] }
 * @returns {Object} - { campo: 'clave.error' | null }
 */
export function validate(values, schema) {
    const errors = {};
    for (const [field, rules] of Object.entries(schema)) {
        for (const rule of rules) {
            const error = rule(values[field]);
            if (error) {
                errors[field] = error;
                break; // Solo el primer error por campo
            }
        }
    }
    return errors;
}

// Uso con i18n:
const schema = {
    name: [validators.required, validators.minLength(2)],
    email: [validators.required, validators.email],
    message: [validators.required, validators.minLength(10)],
};

const errors = validate(formValues, schema);
// errors.name → 'validation.required' (clave i18n)
// UI renderiza: t(errors.name) → "Este campo es obligatorio"
```

### Anti-Patrón

```javascript
// ❌ INCORRECTO — validación inline sin reutilización
function handleSubmit() {
    if (!name) { setNameError('Ingrese nombre'); }
    if (!email) { setEmailError('Ingrese email'); }
    if (email && !email.includes('@')) { setEmailError('Email inválido'); }
    // Texto hardcodeado, sin i18n, no reutilizable
}

// ❌ INCORRECTO — validación solo en el servidor
function handleSubmit() {
    const res = await fetch('/api/contact', { body: formData });
    // Sin validación en el cliente → mala UX, peticiones innecesarias
}
```

---

## Skill 4: Auth Guard

### Propósito

Protección de rutas y componentes que requieren autenticación. Patrón estándar para verificar el estado de auth antes de renderizar.

### Cuándo Usarla

- Al crear rutas protegidas (futuro).
- Al renderizar UI condicional basada en auth.
- Al proteger acciones que requieren login.

### Ejemplo Práctico

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';

/**
 * Guard de rutas protegidas.
 * Redirige a login si el usuario no está autenticado.
 * Muestra loading mientras se verifica la sesión.
 *
 * @param {Object} props
 * @param {string} props.redirectTo - Ruta de redirección (default: '/login')
 */
function ProtectedRoute({ redirectTo = '/login' }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingOverlay visible />;
    }

    if (!isAuthenticated) {
        // Guardar la ubicación actual para redirigir después del login
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <Outlet />;
}

// Uso en App.jsx:
<Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

### Anti-Patrón

```jsx
// ❌ INCORRECTO — check de auth en cada componente
function Dashboard() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    // Duplicado en cada página protegida
}

// ❌ INCORRECTO — sin estado de carga
function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    // Flash de redirect antes de que se cargue la sesión
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <Outlet />;
}

// ❌ INCORRECTO — check de auth basado en localStorage
function ProtectedRoute() {
    const token = localStorage.getItem('token');
    // Acceso directo sin storage.js; vulnerable a tampering
    if (!token) return <Navigate to="/login" />;
    return <Outlet />;
}
```

---

## Skill 5: Logging Pattern

### Propósito

Logging controlado que funciona en desarrollo y se desactiva automáticamente en producción.

### Cuándo Usarla

- Para depuración durante desarrollo.
- Para tracking de errores.
- Para auditoría de operaciones (futuro).

### Ejemplo Práctico

```javascript
/**
 * Logger controlado por entorno.
 * Solo imprime en desarrollo. En producción es silencioso.
 *
 * @param {string} namespace - Módulo o contexto (ej: 'AUTH', 'API')
 */
export function createLogger(namespace) {
    const isDev = import.meta.env.DEV;

    return {
        info: (...args) => {
            if (isDev) console.info(`[${namespace}]`, ...args);
        },
        warn: (...args) => {
            if (isDev) console.warn(`[${namespace}]`, ...args);
        },
        error: (...args) => {
            if (isDev) console.error(`[${namespace}]`, ...args);
        },
        debug: (...args) => {
            if (isDev) console.debug(`[${namespace}]`, ...args);
        },
    };
}

// Uso:
const log = createLogger('Contact');
log.info('Formulario enviado', { email: formData.email });
log.error('Error al enviar', error);
```

### Anti-Patrón

```javascript
// ❌ INCORRECTO — console.log directo
console.log('datos:', userData);
// Se filtra a producción, expone datos, no tiene contexto

// ❌ INCORRECTO — logging de datos sensibles
console.log('Token:', authToken);
console.log('Password:', password);

// ❌ INCORRECTO — sin namespace
console.error('Error!');
// Imposible saber de qué módulo viene
```

---

## Skill 6: Data Fetcher

### Propósito

Wrapper estándar para llamadas HTTP que incluye timeout, retry, manejo de errores y formato de respuesta consistente.

### Cuándo Usarla

- En toda llamada `fetch` a APIs externas.
- En la futura capa `src/services/`.
- Al consumir datos de backends.

### Ejemplo Práctico

```javascript
/**
 * Fetch wrapper con timeout, retry y formato estándar.
 *
 * @param {string} url - URL del endpoint.
 * @param {Object} options - Opciones de fetch + extras.
 * @param {number} options.timeout - Timeout en ms (default: 10000).
 * @param {number} options.retries - Intentos (default: 1).
 * @param {number} options.retryDelay - Delay entre intentos en ms (default: 1000).
 * @returns {Promise<ApiResponse>}
 */
export async function fetchWithRetry(url, options = {}) {
    const {
        timeout = 10000,
        retries = 1,
        retryDelay = 1000,
        ...fetchOptions
    } = options;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return { success: true, data, error: null };

        } catch (error) {
            if (attempt < retries) {
                await new Promise((r) => setTimeout(r, retryDelay * (attempt + 1)));
                continue;
            }

            return {
                success: false,
                data: null,
                error: {
                    code: error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
                    message: error.message,
                    details: { url, attempt: attempt + 1 },
                },
            };
        }
    }
}

// Uso:
const result = await fetchWithRetry('/api/projects', { retries: 2, timeout: 5000 });
if (result.success) {
    setProjects(result.data);
} else {
    showError(t(`errors.${result.error.code}`));
}
```

### Anti-Patrón

```javascript
// ❌ INCORRECTO — fetch sin timeout
const res = await fetch('/api/data');
// Puede colgar indefinidamente

// ❌ INCORRECTO — sin manejo de errores HTTP
const res = await fetch('/api/data');
const data = await res.json();
// Si res.ok es false, data puede ser un error HTML

// ❌ INCORRECTO — retry manual con código duplicado
try {
    const res = await fetch(url);
} catch {
    try {
        const res = await fetch(url); // Duplicación
    } catch {
        console.log('falló'); // Sin estructura
    }
}
```

---

## Skill 7: i18n Key Convention

### Propósito

Convención de nombrado de claves i18n para mantener consistencia y facilitar la búsqueda de traducciones.

### Cuándo Usarla

- Al agregar cualquier texto visible al usuario.
- Al crear mensajes de error.
- Al definir labels de formulario.
- En títulos de página, tooltips, placeholders.

### Ejemplo Práctico

```
Convención: {dominio}.{seccion}.{elemento}

Ejemplos:
├── nav.home                     → "Inicio"
├── nav.about                    → "Sobre mí"
├── hero.title                   → "Hola, soy Cristian"
├── hero.subtitle                → "Desarrollador Full-Stack"
├── projects.title               → "Mis Proyectos"
├── projects.filter.all          → "Todos"
├── projects.card.demo           → "Ver demo"
├── projects.card.repo           → "Ver código"
├── contact.form.name            → "Nombre"
├── contact.form.email           → "Email"
├── contact.form.submit          → "Enviar"
├── contact.success              → "Mensaje enviado"
├── contact.error                → "Error al enviar"
├── auth.login.title             → "Iniciar sesión"
├── auth.login.email             → "Email"
├── auth.login.password          → "Contraseña"
├── auth.errors.invalidCredentials → "Credenciales inválidas"
├── validation.required          → "Este campo es obligatorio"
├── validation.invalidEmail      → "Email no válido"
├── errors.NETWORK_ERROR         → "Error de conexión"
└── errors.TIMEOUT               → "Tiempo de espera agotado"
```

**Reglas:**
1. Siempre en minúsculas con camelCase para elementos.
2. Máximo 4 niveles de anidación.
3. Agregar en `es.json` y `en.json` simultáneamente.
4. Fallback al español (`es`) siempre.

### Anti-Patrón

```
// ❌ INCORRECTO — claves sin estructura
"titulo" → imposible saber de qué sección
"btn1" → no descriptivo
"error_msg" → inconsistencia (underscore vs camelCase)

// ❌ INCORRECTO — texto hardcodeado
<Button>Enviar</Button>           // Sin i18n
<Text>Error al cargar</Text>      // Sin i18n

// ❌ INCORRECTO — clave solo en un idioma
// es.json: { "contact.success": "Enviado" }
// en.json: (falta la clave)
```

---

## Skill 8: Safe Storage Access

### Propósito

Acceso seguro a `localStorage` y cookies a través de la capa de abstracción de `src/utils/storage.js`. Previene errores en entornos sin acceso a storage.

### Cuándo Usarla

- Al leer/escribir preferencias de usuario (idioma, tema).
- Al persistir estado de sesión (futuro).
- En cualquier acceso a storage del navegador.

### Ejemplo Práctico

```javascript
// src/utils/storage.js ya provee estas funciones:
import {
    safeLocalStorageGet,
    safeLocalStorageSet,
    safeLocalStorageRemove,
    readCookie,
    writeCookie,
} from '../utils/storage';

// ✅ CORRECTO — leer preferencia de idioma
const lang = safeLocalStorageGet('lang') || 'es';

// ✅ CORRECTO — guardar preferencia
safeLocalStorageSet('lang', 'en');

// ✅ CORRECTO — leer cookie
const langCookie = readCookie('lang');

// ✅ CORRECTO — escribir cookie con opciones
writeCookie('lang', 'en', { maxAgeDays: 365 });

// ✅ CORRECTO — limpiar storage
safeLocalStorageRemove('sessionData');
```

**Claves de storage registradas:**

| Clave                         | Dominio    | Tipo          | Contenido                  |
|-------------------------------|------------|---------------|----------------------------|
| `lang`                        | UI / i18n  | localStorage  | `'es'` o `'en'`           |
| `lang`                        | UI / i18n  | cookie        | `'es'` o `'en'`           |
| `mantine-color-scheme-value`  | UI / tema  | localStorage  | `'light'` o `'dark'`      |

### Anti-Patrón

```javascript
// ❌ INCORRECTO — acceso directo a localStorage
localStorage.setItem('lang', 'en');
// Rompe en SSR, iframes restringidos, modo privado

// ❌ INCORRECTO — acceso directo a cookies
document.cookie = 'lang=en';
// Sin manejo de errores, sin opciones de seguridad

// ❌ INCORRECTO — clave no registrada sin documentar
safeLocalStorageSet('myCustomKey', value);
// Clave no está en la tabla de claves registradas

// ❌ INCORRECTO — almacenar datos sensibles
safeLocalStorageSet('authToken', token);
// Tokens deben estar en httpOnly cookies, no en localStorage
```

---

## Cómo Agregar un Nuevo Skill

1. Asignar un número secuencial y agregar al índice.
2. Seguir la estructura: **Propósito → Cuándo Usarla → Ejemplo Práctico → Anti-Patrón**.
3. Indicar qué dominios lo usan en el índice.
4. El ejemplo debe ser código funcional, no pseudocódigo.
5. El anti-patrón debe mostrar al menos 2 errores comunes con explicación.
6. Mantener coherencia con las reglas de `AGENTS.md`.

---

*Última actualización: 2026-02-16*
