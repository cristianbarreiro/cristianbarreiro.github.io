---
name: portfolio-validation
description: Protocolo de validación técnica obligatoria (Definition of Done) para verificar linter, compilación, paridad i18n y persistencia segura.
---

# Skill: Protocolo de Validación y Definition of Done (DoD)

> Esta skill define la secuencia obligatoria de comprobaciones antes de dar por terminada cualquier tarea de código o documentación en el repositorio.

---

## 1. Secuencia de Validación Ejecutable

Ejecuta los siguientes pasos en orden:

### Paso 1: Linter Obligatorio
```bash
npm run lint
```
- **Criterio:** Debe finalizar con código 0 (`0 errors`).
- No utilizar directivas `eslint-disable` para silenciar problemas legítimos.

### Paso 2: Paridad de Traducciones i18n
```bash
node -e "const es=require('./public/locales/es.json'),en=require('./public/locales/en.json');function k(o,p=''){return Object.keys(o).flatMap(x=>typeof o[x]==='object'&&o[x]!==null&&!Array.isArray(o[x])?k(o[x],p+x+'.'):[p+x]);}const sE=new Set(k(es)),sN=new Set(k(en));const d=[...sE].filter(x=>!sN.has(x)).concat([...sN].filter(x=>!sE.has(x)));if(d.length){console.error('Error i18n faltantes:',d);process.exit(1);}console.log('✅ Paridad i18n perfecta ('+sE.size+' claves).');"
```
- **Criterio:** Cero claves huérfanas o faltantes entre `es.json` y `en.json`.

### Paso 3: Compilación de Producción
```bash
npm run build
```
- **Criterio:** Salida exitosa en `dist/`.
- Verificar que el bundle mantenga `TechGlobe` desacoplado como un chunk separado.

---

## 2. Auditoría Estática de Invariantes

Antes de cerrar la tarea, confirma visualmente en tu diff que:
- [ ] No existen llamadas directas a `localStorage` o `document.cookie` (se usó exclusivamente `src/utils/storage.js`).
- [ ] No se introdujeron tipos de TypeScript (`interface`, `type`, `.ts`, `.tsx`).
- [ ] No se añadieron endpoints de backend, Express o dependencias superfluas en `package.json`.
- [ ] No se introdujeron strings visibles hardcodeados en JSX (se usó `useTranslation`).
- [ ] Los nuevos elementos interactivos cuentan con `aria-label`.

---

## 3. Acciones Estrictamente Prohibidas

- ❌ **`npm run deploy`:** Publica directamente a GitHub Pages. **PROHIBIDO** ejecutar sin orden humana explícita.
- ❌ **Comandos Git destructivos:** Prohibido `git reset --hard`, `git clean -fd`, `git push --force`.
