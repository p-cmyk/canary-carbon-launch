#!/usr/bin/env node
/**
 * Construye una versión autónoma (un solo HTML) de Canicarbon HQ para poder
 * verla sin servidor: en el móvil, en la tele o como Artifact.
 * Intercepta window.fetch y sirve los datos embebidos; los cambios que haga
 * Pablo se guardan en localStorage del navegador (no en el repo).
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'hq/data');
const docsDir = join(root, 'hq/docs');
const pubDir = join(root, 'hq/public');

const DATA_FILES = ['company', 'products', 'contacts', 'finances', 'personal', 'projects', 'ideas', 'decisions', 'roadmap', 'settings'];
const data = {};
for (const f of DATA_FILES) data[f] = JSON.parse(readFileSync(join(dataDir, f + '.json'), 'utf8'));

const docs = {};
for (const f of readdirSync(docsDir).filter(f => f.endsWith('.md'))) docs[f] = readFileSync(join(docsDir, f), 'utf8');

const seedEvents = readFileSync(join(dataDir, 'events.jsonl'), 'utf8').trim().split('\n')
  .map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

const css = readFileSync(join(pubDir, 'app.css'), 'utf8');
const appjs = readFileSync(join(pubDir, 'app.js'), 'utf8');

const shim = `
/* ===== modo autónomo: sin servidor, datos embebidos + localStorage ===== */
window.__SEED__ = ${JSON.stringify(data)};
window.__DOCS__ = ${JSON.stringify(docs)};
window.__SEED_EVENTS__ = ${JSON.stringify(seedEvents)};
const LS = {
  data() { try { return JSON.parse(localStorage.getItem('hq-standalone-data')) || null; } catch { return null; } },
  setData(d) { localStorage.setItem('hq-standalone-data', JSON.stringify(d)); },
  events() { try { return JSON.parse(localStorage.getItem('hq-standalone-events')) || window.__SEED_EVENTS__.slice(); } catch { return window.__SEED_EVENTS__.slice(); } },
  addEvent(ev) { const e = LS.events(); e.push(ev); localStorage.setItem('hq-standalone-events', JSON.stringify(e)); return ev; }
};
function currentData() { return LS.data() || JSON.parse(JSON.stringify(window.__SEED__)); }
function jsonResp(obj) { return { ok: true, headers: { get: () => 'application/json' }, json: async () => obj, text: async () => JSON.stringify(obj) }; }
function textResp(str) { return { ok: true, headers: { get: () => 'text/markdown' }, text: async () => str, json: async () => JSON.parse(str) }; }
window.fetch = async (path, opts = {}) => {
  const method = (opts.method || 'GET').toUpperCase();
  const body = opts.body ? JSON.parse(opts.body) : {};
  if (path === '/api/data') return jsonResp(currentData());
  if (path.startsWith('/api/data/') && method === 'PUT') {
    const name = path.split('/')[3];
    const d = currentData(); d[name] = body.data; LS.setData(d);
    LS.addEvent({ ts: new Date().toISOString(), actor: 'pablo', type: 'save', section: name, detail: body.detail || 'edición', why: body.why || null });
    return jsonResp({ ok: true });
  }
  if (path === '/api/event' && method === 'POST') { const ev = { ts: new Date().toISOString(), ...body }; LS.addEvent(ev); return jsonResp(ev); }
  if (path.startsWith('/api/events')) {
    const evs = LS.events().map((e, i) => ({ ...e, _i: i }));
    return jsonResp({ total: evs.length, events: evs.reverse() });
  }
  if (path === '/api/restore') return jsonResp({ ok: true });
  if (path === '/api/docs') return jsonResp({ docs: Object.keys(window.__DOCS__) });
  if (path.startsWith('/api/docs/')) { const n = decodeURIComponent(path.split('/')[3]); return textResp(window.__DOCS__[n] || '# no encontrado'); }
  if (path === '/api/git-sync') return jsonResp({ ok: true, pushed: false, note: 'Esta es la versión de demostración (sin servidor). Para guardar en el repo, arranca node hq/server.js en tu ordenador.' });
  return { ok: false, headers: { get: () => 'text/plain' }, text: async () => 'no encontrado', json: async () => ({}) };
};
`;

const banner = `<div id="demo-banner" style="position:fixed;bottom:0;left:0;right:0;z-index:300;background:rgba(240,180,41,.12);border-top:1px solid rgba(240,180,41,.4);color:#f0b429;font:600 13px/1.4 -apple-system,sans-serif;padding:8px 14px;text-align:center;backdrop-filter:blur(10px)">
  Versión de demostración · tus cambios se guardan solo en este navegador · para el sistema real: <code>node hq/server.js</code>
  <button onclick="this.parentElement.remove()" style="background:none;border:1px solid rgba(240,180,41,.5);color:#f0b429;border-radius:8px;padding:0 8px;margin-left:10px;cursor:pointer">ocultar</button>
</div>`;

const html = `<style>${css}
/* el banner de demo no tapa la barra móvil */
@media (max-width:900px){ .bottombar{ bottom:34px } .whybar{ bottom:130px } }
main{ padding-bottom:120px }
</style>
<div id="app">
  <div class="boot"><div class="boot-logo">CANICARBON <span>HQ</span></div><div class="boot-msg">Cargando…</div></div>
</div>
${banner}
<script>${shim}
${appjs}
</script>`;

writeFileSync(join(root, 'hq/standalone.html'), html);
console.log('Escrito hq/standalone.html (' + Math.round(html.length / 1024) + ' KB)');
