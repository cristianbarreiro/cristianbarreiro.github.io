# AUTH_AGENTS.md — Dominio de Autenticación y Autorización

> Archivo de gobernanza para agentes que operan sobre la capa de autenticación.  
> Leer `AGENTS.md` antes de este archivo.

---

## 1. Responsabilidad Principal

El dominio AUTH es responsable de:

- Gestión de identidad (login, registro, logout)
- Generación y revocación de tokens
- Guards y protección de rutas
- Políticas de acceso y permisos
- Manejo seguro de credenciales

---

## 2. Estado Actual

> **IMPORTANTE:** Este dominio está **inactivo**. El proyecto actual es un portfolio  
> estático sin autenticación. Este archivo define las reglas para cuando se implemente.  
> Ningún agente debe crear infraestructura de auth sin aprobación explícita del owner.

### Estado de activación

| Componente         | Estado      | Ubicación futura                    |
|--------------------|-------------|-------------------------------------|
| Login/Registro     | ❌ Inactivo  | `src/pages/Login.jsx`               |
| Token management   | ❌ Inactivo  | `src/services/auth.js`              |
| Route guards       | ❌ Inactivo  | `src/components/ProtectedRoute.jsx` |
| Auth context       | ❌ Inactivo  | `src/contexts/AuthContext.jsx`      |
| Auth utils         | ❌ Inactivo  | `src/utils/auth.js`                 |

---

## 3. Qué Puede Modificar (Cuando se Active)

| Recurso                                | Acción permitida                          |
|----------------------------------------|-------------------------------------------|
| `src/services/auth.js`                 | Crear, editar servicio de auth            |
| `src/contexts/AuthContext.jsx`         | Crear, editar contexto de autenticación   |
| `src/components/ProtectedRoute.jsx`    | Crear, editar guard de rutas              |
| `src/pages/Login.jsx`                  | Crear, editar página de login             |
| `src/pages/Register.jsx`              | Crear, editar página de registro          |
| `src/utils/auth.js`                   | Crear, editar utilidades de auth          |

---

## 4. Qué NO Puede Modificar

| Recurso                       | Motivo                                                |
|-------------------------------|-------------------------------------------------------|
| `src/components/*.jsx`        | Pertenece al dominio UI (coordinar si afecta auth)    |
| `src/data/*.js`               | Pertenece al dominio API                              |
| `src/config/siteConfig.js`    | Configuración protegida                               |
| `src/utils/storage.js`        | Infraestructura compartida (coordinar cambios)        |
| `public/locales/*.json`       | Pertenece al dominio UI (solicitar claves i18n)       |
| `src/i18n.js`                 | Infraestructura compartida                            |

---

## 5. Contratos de Entrada/Salida

### 5.1 AUTH → UI

```javascript
// AuthContext provee:
const authContext = {
    user: Object | null,        // Datos del usuario autenticado
    isAuthenticated: Boolean,   // Estado de autenticación
    isLoading: Boolean,         // Cargando estado de auth
    login: Function,            // (credentials) => Promise<void>
    logout: Function,           // () => Promise<void>
    register: Function,         // (userData) => Promise<void>
    error: String | null        // Último error de auth
};
```

**Reglas:**
- UI accede a auth exclusivamente vía `useAuth()` hook del contexto.
- UI nunca manipula tokens directamente.
- UI muestra estados de carga y error; AUTH los provee.

### 5.2 AUTH → API

```
Flujo de request autenticado:

1. AUTH almacena token al hacer login
2. API lee token desde AUTH (via header o context)
3. API adjunta 'Authorization: Bearer <token>' en cada request
4. Backend valida el token
5. Si token expirado → AUTH intenta refresh
6. Si refresh falla → AUTH ejecuta logout
```

**Contrato de token:**

```javascript
const tokenContract = {
    storage: 'httpOnly cookie preferido; localStorage como fallback',
    format: 'JWT (JSON Web Token)',
    header: 'Authorization: Bearer <token>',
    refresh: 'Automático y transparente para la UI',
    expiration: 'Definida por el backend; AUTH gestiona renovación',
    revocation: 'Logout invalida tokens en cliente y servidor'
};
```

### 5.3 AUTH → Persistencia

```
Almacenamiento de sesión:
- Tokens:     httpOnly cookies (preferido) o storage.js helpers
- User data:  En memoria (AuthContext state), NO en localStorage
- Preferencia: Nunca almacenar datos sensibles en localStorage sin cifrar
```

### 5.4 AUTH → Rutas

```jsx
// ProtectedRoute.jsx — Guard de rutas
<Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
</Route>

// Comportamiento:
// - Si autenticado → renderiza children
// - Si no autenticado → redirige a /login
// - Si cargando → muestra loading spinner
```

---

## 6. Reglas Técnicas Específicas

### 6.1 Seguridad

- **NUNCA** almacenar contraseñas en texto plano (ni en cliente ni en servidor).
- **NUNCA** incluir secrets, tokens o claves API en el código fuente.
- **NUNCA** loguear tokens o credenciales en `console.log`.
- Usar HTTPS exclusivamente para cualquier comunicación con auth.
- Implementar CSRF protection si se usan cookies.
- Sanitizar todos los inputs del usuario en formularios de auth.

### 6.2 Tokens

- Preferir tokens de corta duración con refresh tokens.
- Implementar refresh automático antes de la expiración.
- Limpiar tokens en logout (cliente + servidor).
- No decodificar JWTs en el cliente para decisiones de seguridad.

### 6.3 Estado de Autenticación

```jsx
// Patrón recomendado: AuthProvider en el árbol de componentes
<AuthProvider>
    <MantineProvider>
        <RouterProvider router={router} />
    </MantineProvider>
</AuthProvider>
```

- AuthContext como single source of truth para el estado de auth.
- No duplicar estado de auth en componentes individuales.
- Usar `useAuth()` hook para acceder al contexto.

### 6.4 Manejo de Errores de Auth

```javascript
// Códigos de error estándar
const authErrors = {
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    TOKEN_EXPIRED: 'Sesión expirada',
    TOKEN_INVALID: 'Token inválido',
    NETWORK_ERROR: 'Error de conexión',
    USER_NOT_FOUND: 'Usuario no encontrado',
    EMAIL_IN_USE: 'Email ya registrado',
    WEAK_PASSWORD: 'Contraseña muy débil',
    UNAUTHORIZED: 'No autorizado',
    RATE_LIMITED: 'Demasiados intentos'
};
```

- Todos los errores deben tener clave i18n para soporte ES/EN.
- Usar el patrón `ApiResponse` de `skills/skills.md`.
- Feedback claro al usuario sin exponer detalles internos.

### 6.5 i18n en Auth

- Mensajes de error: claves en `public/locales/{lang}.json` bajo el namespace `auth.*`.
- Labels de formularios: `auth.login.email`, `auth.login.password`, etc.
- Coordinar con dominio UI para agregar claves de traducción.

---

## 7. Criterios de Calidad

| Criterio                   | Estándar                                            |
|----------------------------|-----------------------------------------------------|
| Seguridad                  | 0 secrets en código; HTTPS obligatorio              |
| Manejo de errores          | Feedback claro; sin datos internos expuestos         |
| UX de auth                 | Loading states; errores legibles; redirect limpio    |
| i18n                       | Todos los mensajes de auth en ES + EN                |
| Persistencia               | Tokens en httpOnly cookies preferido                 |
| Separación de concerns     | Auth no renderiza UI; UI no gestiona tokens          |

---

## 8. Checklist de Tarea Completa

Antes de considerar una tarea de AUTH como terminada:

- [ ] No hay secrets, tokens o credenciales en el código fuente.
- [ ] AuthContext provee `user`, `isAuthenticated`, `isLoading`, `error`.
- [ ] Login/logout manejan todos los edge cases (red, timeout, token expirado).
- [ ] ProtectedRoute redirige a login cuando no hay sesión.
- [ ] Mensajes de error tienen claves i18n en ES y EN.
- [ ] Tokens se limpian completamente en logout.
- [ ] No hay `console.log` de datos sensibles.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npm run build` compila sin errores.
- [ ] El patrón `AuthGuard` de `skills/skills.md` se usa correctamente.
- [ ] Formularios de auth son accesibles (labels, ARIA, teclado).
- [ ] El cambio es atómico y reversible.

---

## 9. Dependencias Cruzadas

| Si la tarea involucra…           | Coordinar con…     | Acción                                         |
|----------------------------------|--------------------|-------------------------------------------------|
| Componentes visuales de auth     | Dominio UI         | UI crea los componentes; AUTH provee la lógica   |
| Llamadas al backend de auth      | Dominio API        | API provee el cliente HTTP; AUTH define endpoints |
| Claves de traducción             | Dominio UI         | UI agrega claves bajo `auth.*` en locales        |
| Nuevas rutas protegidas          | Owner + UI         | Aprobación para nuevas rutas; UI registra en App |
| Almacenamiento de sesión         | Infraestructura    | Usar `storage.js` o httpOnly cookies             |
| Guards en rutas existentes       | Dominio UI         | Verificar que rutas públicas no se afecten       |

---

## 10. Plan de Activación

Cuando el owner apruebe la implementación de auth:

1. Crear `src/contexts/AuthContext.jsx` con el contrato §5.1.
2. Crear `src/services/auth.js` con el patrón ApiResponse.
3. Crear `src/components/ProtectedRoute.jsx` según §5.4.
4. Crear `src/pages/Login.jsx` con formulario accesible.
5. Agregar claves i18n bajo `auth.*` en ambos archivos de locales.
6. Envolver la app en `<AuthProvider>` en `src/main.jsx`.
7. Registrar rutas protegidas en `src/App.jsx`.
8. Ejecutar checklist completo (§8).

---

*Última actualización: 2026-02-16*
