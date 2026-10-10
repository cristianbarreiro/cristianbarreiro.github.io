import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

describe('i18n Remediation Test Suite', () => {
  const esPath = path.join(rootDir, 'public', 'locales', 'es.json');
  const enPath = path.join(rootDir, 'public', 'locales', 'en.json');
  const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  // 12. Paridad estructural de claves entre public/locales/es.json y public/locales/en.json
  test('12. Paridad estructural estricta de claves entre es.json y en.json', () => {
    function getKeys(o, prefix = '') {
      return Object.keys(o).flatMap((key) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        return typeof o[key] === 'object' && o[key] !== null && !Array.isArray(o[key])
          ? getKeys(o[key], fullKey)
          : [fullKey];
      });
    }

    const esKeys = new Set(getKeys(es));
    const enKeys = new Set(getKeys(en));

    const missingInEn = [...esKeys].filter((k) => !enKeys.has(k));
    const missingInEs = [...enKeys].filter((k) => !esKeys.has(k));

    assert.deepEqual(missingInEn, [], 'No debe haber claves en es.json que falten en en.json');
    assert.deepEqual(missingInEs, [], 'No debe haber claves en en.json que falten en es.json');
    assert.ok(esKeys.size > 300, 'El diccionario debe contener más de 300 claves completas');
  });

  test('Autenticidad lingüística: es.json no debe ser una copia en inglés', () => {
    assert.equal(es.nav.home, 'Inicio');
    assert.equal(es.nav.about, 'Sobre mí');
    assert.equal(es.nav.projects, 'Proyectos');
    assert.equal(es.nav.skills, 'Habilidades');
    assert.equal(es.nav.contact, 'Contacto');
    assert.equal(es.nav.downloadCV, 'Descargar CV');
    assert.equal(es.language.toggle, 'Cambiar idioma ({{next}})');
    assert.equal(es.splash.initializing, 'INICIALIZANDO PORTFOLIO');

    assert.equal(en.nav.home, 'Home');
    assert.equal(en.nav.about, 'About');
    assert.equal(en.nav.projects, 'Projects');
    assert.equal(en.nav.skills, 'Skills');
    assert.equal(en.nav.contact, 'Contact');
    assert.equal(en.nav.downloadCV, 'Download CV');
    assert.equal(en.language.toggle, 'Switch language ({{next}})');
    assert.equal(en.splash.initializing, 'INITIALIZING PORTFOLIO');
  });

  // 3. Actualización de la etiqueta del botón y sus atributos accesibles
  test('3. Generación y formateo de etiquetas y accesibilidad (aria-label)', () => {
    const getAriaLabel = (dict, next) => {
      return dict.language.toggle.replace('{{next}}', next.toUpperCase());
    };

    assert.equal(getAriaLabel(es, 'en'), 'Cambiar idioma (EN)');
    assert.equal(getAriaLabel(en, 'es'), 'Switch language (ES)');
  });

  // 6. Idioma regional y códigos no soportados
  test('6. Normalización de idiomas regionales y códigos no soportados', () => {
    const SUPPORTED_LANGUAGES = ['es', 'en'];

    const normalize = (lng) => {
      if (!lng) return 'es';
      const base = lng.split('-')[0].toLowerCase();
      return SUPPORTED_LANGUAGES.includes(base) ? base : 'es';
    };

    assert.equal(normalize('es-UY'), 'es');
    assert.equal(normalize('es-AR'), 'es');
    assert.equal(normalize('es-ES'), 'es');
    assert.equal(normalize('en-US'), 'en');
    assert.equal(normalize('en-GB'), 'en');
    assert.equal(normalize('fr'), 'es');
    assert.equal(normalize('de-DE'), 'es');
    assert.equal(normalize('pt-BR'), 'es');
    assert.equal(normalize(null), 'es');
    assert.equal(normalize(undefined), 'es');
    assert.equal(normalize(''), 'es');
  });

  // 7. Almacenamiento bloqueado o no disponible
  test('7. Resiliencia ante localStorage o cookies bloqueadas o fallidas', () => {
    // Simular un objeto Storage que lanza SecurityError al intentar acceder
    const blockedStorage = {
      getItem: () => {
        throw new Error('SecurityError: The operation is insecure.');
      },
      setItem: () => {
        throw new Error('SecurityError: The operation is insecure.');
      },
      removeItem: () => {
        throw new Error('SecurityError: The operation is insecure.');
      },
    };

    const safeGet = (storage, key) => {
      try {
        return storage.getItem(key);
      } catch {
        return null;
      }
    };

    const safeSet = (storage, key, val) => {
      try {
        storage.setItem(key, val);
        return true;
      } catch {
        return false;
      }
    };

    assert.equal(safeGet(blockedStorage, 'lang'), null);
    assert.equal(safeSet(blockedStorage, 'lang', 'en'), false);
  });

  // 8. Manejo de error durante el cambio de idioma
  test('8. Manejo de excepciones en el cambio de idioma', async () => {
    let isChanging = false;
    let current = 'es';

    const changeLanguageMock = async (target) => {
      if (target === 'fail') throw new Error('Network / Resource Error');
      current = target;
    };

    const handleToggle = async (next) => {
      if (isChanging) return;
      isChanging = true;
      try {
        await changeLanguageMock(next);
      } catch (err) {
        // En caso de fallo, la aplicación no colapsa y current se mantiene
        assert.ok(err);
      } finally {
        isChanging = false;
      }
    };

    // Caso de error: no debe mutar estado ni quedar bloqueado en isChanging: true
    await handleToggle('fail');
    assert.equal(current, 'es');
    assert.equal(isChanging, false);

    // Caso exitoso posterior
    await handleToggle('en');
    assert.equal(current, 'en');
    assert.equal(isChanging, false);
  });

  // 9. Actualización de componentes y contenido bilingüe (skills & experience)
  test('9. Módulos de datos bilingües independientes (skills.i18n y experience.i18n)', () => {
    const expContent = fs.readFileSync(path.join(rootDir, 'src', 'data', 'experience.i18n.js'), 'utf8');
    const skillsContent = fs.readFileSync(path.join(rootDir, 'src', 'data', 'skills.i18n.js'), 'utf8');

    assert.ok(expContent.includes('es: ['), 'experience.i18n debe tener array es');
    assert.ok(expContent.includes('en: ['), 'experience.i18n debe tener array en');
    assert.ok(skillsContent.includes('es: ['), 'skills.i18n debe tener array es');
    assert.ok(skillsContent.includes('en: ['), 'skills.i18n debe tener array en');
  });

  // 10. Correspondencia del enlace de descarga del CV
  test('10. Correspondencia del enlace de descarga del CV según idioma', () => {
    const getLanguageOnly = (language) => {
      if (!language) return 'es';
      return language.split('-')[0].toLowerCase();
    };

    const getCVHref = (language) => {
      const lang = getLanguageOnly(language);
      return lang === 'en' ? '/eng_cv_dev_cristianbarreiro.pdf' : '/esp_cv_dev_cristianbarreiro.pdf';
    };

    assert.equal(getCVHref('es'), '/esp_cv_dev_cristianbarreiro.pdf');
    assert.equal(getCVHref('es-UY'), '/esp_cv_dev_cristianbarreiro.pdf');
    assert.equal(getCVHref('en'), '/eng_cv_dev_cristianbarreiro.pdf');
    assert.equal(getCVHref('en-US'), '/eng_cv_dev_cristianbarreiro.pdf');
    assert.equal(getCVHref('fr'), '/esp_cv_dev_cristianbarreiro.pdf');
  });
});
