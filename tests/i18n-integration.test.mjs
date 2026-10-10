import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9223; // Use distinct port to prevent collisions

describe('i18n Browser Integration Test Suite', () => {
  let edge;
  let ws;
  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    return res?.result?.value;
  }

  test('E2E: Verificación completa de ciclo de vida i18n en navegador real', async () => {
    edge = spawn(edgePath, [
      `--remote-debugging-port=${port}`,
      '--headless=new',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=' + process.env.TEMP + '\\edge_i18n_test_' + Date.now(),
      'http://localhost:4173/',
    ]);

    let target = null;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 400));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json`);
        const targets = await res.json();
        target = targets.find((t) => t.type === 'page' && t.url.includes('4173'));
        if (target) break;
      } catch {}
    }

    assert.ok(target, 'Debe conectarse a Edge DevTools');

    ws = new WebSocket(target.webSocketDebuggerUrl);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise((r) => (ws.onopen = r));
    await send('Runtime.enable');
    await send('Page.enable');

    // Esperar carga y omitir splash screen
    await new Promise((r) => setTimeout(r, 2000));
    await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }))`);
    await new Promise((r) => setTimeout(r, 600));

    // 1. Estado inicial
    const initial = await evaluate(`({
      langLS: localStorage.getItem('lang'),
      htmlLang: document.documentElement.lang,
      btnText: document.querySelector('header button.subtle-shake-hover')?.textContent?.trim(),
      btnAria: document.querySelector('header button.subtle-shake-hover')?.getAttribute('aria-label'),
      navLinks: Array.from(document.querySelectorAll('header .menu-link')).map(a => a.textContent.trim()),
      cvHref: document.querySelector('header a[download]')?.getAttribute('href'),
      cvText: document.querySelector('header a[download]')?.textContent?.trim()
    })`);

    assert.equal(initial.htmlLang, 'es');
    assert.equal(initial.btnText, 'Lenguaje');
    assert.equal(initial.btnAria, 'Cambiar idioma (EN)');
    assert.deepEqual(initial.navLinks, ['Inicio', 'Sobre mí', 'Proyectos', 'Contacto']);
    assert.equal(initial.cvHref, '/esp_cv_dev_cristianbarreiro.pdf');
    assert.equal(initial.cvText, 'Descargar CV');

    // 2. Cambio a inglés sin recargar
    await evaluate(`document.querySelector('header button.subtle-shake-hover')?.click()`);
    await new Promise((r) => setTimeout(r, 600));

    const afterEn = await evaluate(`({
      langLS: localStorage.getItem('lang'),
      htmlLang: document.documentElement.lang,
      btnText: document.querySelector('header button.subtle-shake-hover')?.textContent?.trim(),
      btnAria: document.querySelector('header button.subtle-shake-hover')?.getAttribute('aria-label'),
      navLinks: Array.from(document.querySelectorAll('header .menu-link')).map(a => a.textContent.trim()),
      cvHref: document.querySelector('header a[download]')?.getAttribute('href'),
      cvText: document.querySelector('header a[download]')?.textContent?.trim()
    })`);

    assert.equal(afterEn.langLS, 'en');
    assert.equal(afterEn.htmlLang, 'en');
    assert.equal(afterEn.btnText, 'Language');
    assert.equal(afterEn.btnAria, 'Switch language (ES)');
    assert.deepEqual(afterEn.navLinks, ['Home', 'About', 'Projects', 'Contact']);
    assert.equal(afterEn.cvHref, '/eng_cv_dev_cristianbarreiro.pdf');
    assert.equal(afterEn.cvText, 'Download CV');

    // 3. Persistencia de inglés tras recargar
    await send('Page.reload');
    await new Promise((r) => setTimeout(r, 2000));
    await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }))`);
    await new Promise((r) => setTimeout(r, 500));

    const reloadedEn = await evaluate(`({
      langLS: localStorage.getItem('lang'),
      htmlLang: document.documentElement.lang,
      btnText: document.querySelector('header button.subtle-shake-hover')?.textContent?.trim(),
      navLinks: Array.from(document.querySelectorAll('header .menu-link')).map(a => a.textContent.trim())
    })`);

    assert.equal(reloadedEn.langLS, 'en');
    assert.equal(reloadedEn.htmlLang, 'en');
    assert.equal(reloadedEn.btnText, 'Language');
    assert.deepEqual(reloadedEn.navLinks, ['Home', 'About', 'Projects', 'Contact']);

    // 4. Vuelta a español sin recargar
    await evaluate(`document.querySelector('header button.subtle-shake-hover')?.click()`);
    await new Promise((r) => setTimeout(r, 600));

    const backToEs = await evaluate(`({
      langLS: localStorage.getItem('lang'),
      htmlLang: document.documentElement.lang,
      btnText: document.querySelector('header button.subtle-shake-hover')?.textContent?.trim(),
      btnAria: document.querySelector('header button.subtle-shake-hover')?.getAttribute('aria-label'),
      navLinks: Array.from(document.querySelectorAll('header .menu-link')).map(a => a.textContent.trim()),
      cvHref: document.querySelector('header a[download]')?.getAttribute('href')
    })`);

    assert.equal(backToEs.langLS, 'es');
    assert.equal(backToEs.htmlLang, 'es');
    assert.equal(backToEs.btnText, 'Lenguaje');
    assert.equal(backToEs.btnAria, 'Cambiar idioma (EN)');
    assert.deepEqual(backToEs.navLinks, ['Inicio', 'Sobre mí', 'Proyectos', 'Contacto']);
    assert.equal(backToEs.cvHref, '/esp_cv_dev_cristianbarreiro.pdf');

    // 5. Navegación a ruta diferida (About) y verificación de contenido bilingüe
    await evaluate(`document.querySelectorAll('header .menu-link')[1]?.click()`);
    await new Promise((r) => setTimeout(r, 1200));

    const aboutPageEs = await evaluate(`({
      title: document.querySelector('h1')?.textContent?.trim(),
      hasExp: document.body.textContent.includes('Experiencia')
    })`);
    assert.ok(aboutPageEs.hasExp, 'Debe mostrar contenido en español en la página About');

    // Alternar idioma en la vista diferida About
    await evaluate(`document.querySelector('header button.subtle-shake-hover')?.click()`);
    await new Promise((r) => setTimeout(r, 600));

    const aboutPageEn = await evaluate(`({
      hasExpEn: document.body.textContent.includes('Experience'),
      btnText: document.querySelector('header button.subtle-shake-hover')?.textContent?.trim()
    })`);
    assert.ok(aboutPageEn.hasExpEn, 'Debe reaccionar y mostrar contenido en inglés en About');
    assert.equal(aboutPageEn.btnText, 'Language');

    ws.close();
    edge.kill();
  });
});
