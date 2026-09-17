---
name: portfolio-i18n
description: Procedimiento operativo para mantener la consistencia bilingüe estricta entre las cadenas de traducción en español e inglés.
---

# Skill: Consistencia e Internacionalización (i18n)

> Esta skill define el flujo de trabajo para añadir, editar y validar cadenas de texto traducidas en el portfolio.

---

## 1. Fuentes de Verdad

Los recursos lingüísticos se estructuran en formato JSON dentro de:
- **Español (Idioma base / fallback):** `public/locales/es.json`
- **Inglés:** `public/locales/en.json`

---

## 2. Invariantes Críticos

1. **Cero texto hardcodeado:** Todo string visible al usuario en componentes o páginas **debe** consumirse mediante:
   ```jsx
   import { useTranslation } from 'react-i18next';

   function MiComponente() {
     const { t } = useTranslation();
     return <h1>{t('seccion.titulo')}</h1>;
   }
   ```
2. **Sincronía estricta:** Cada clave declarada en `es.json` **debe existir exactamente con la misma ruta y estructura** en `en.json`.
3. **Nomenclatura camelCase anidada:** Agrupar claves por sección o componente:
   ```json
   {
     "home": {
       "hero": {
         "greeting": "Hola, soy",
         "role": "Desarrollador Full Stack"
       }
     }
   }
   ```

---

## 3. Procedimiento para Añadir una Nueva Cadena

1. Identificar la sección apropiada en `public/locales/es.json`.
2. Insertar la clave con su copy en español.
3. Abrir inmediatamente `public/locales/en.json` e insertar la misma clave con su traducción en inglés.
4. Si la cadena incluye variables dinámicas, usar sintaxis de llaves dobles:
   ```json
   "totalCount": "Mostrando {{count}} proyectos"
   ```
   Y consumir en JSX pasando el objeto:
   ```jsx
   t('seccion.totalCount', { count: total })
   ```

---

## 4. Script de Validación de Paridad (One-Liner)

Antes de dar por completado cualquier cambio de i18n, ejecuta esta comprobación en terminal:

```bash
node -e "const es=require('./public/locales/es.json'),en=require('./public/locales/en.json');function k(o,p=''){return Object.keys(o).flatMap(x=>typeof o[x]==='object'&&o[x]!==null&&!Array.isArray(o[x])?k(o[x],p+x+'.'):[p+x]);}const sE=new Set(k(es)),sN=new Set(k(en));const d=[...sE].filter(x=>!sN.has(x)).concat([...sN].filter(x=>!sE.has(x)));if(d.length){console.error('Error i18n faltantes:',d);process.exit(1);}console.log('✅ Paridad i18n perfecta ('+sE.size+' claves).');"
```

El script debe finalizar con código 0 indicando `✅ Paridad i18n perfecta`.
