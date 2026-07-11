#!/usr/bin/env node
/**
 * Canicarbon HQ — servidor local sin dependencias.
 * Uso: node hq/server.js  →  http://localhost:4747
 *
 * - Sirve la interfaz (hq/public)
 * - API de datos sobre hq/data/*.json
 * - Registro append-only en hq/data/events.jsonl (nunca se borra nada)
 * - Cada guardado conserva la versión anterior dentro del evento → viaje en el tiempo
 * - POST /api/git-sync hace commit+push de hq/data para que Claude lo lea
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.HQ_PORT || 4747;
const ROOT = __dirname;
const DATA = path.join(ROOT, 'data');
const DOCS = path.join(ROOT, 'docs');
const PUB = path.join(ROOT, 'public');
const EVENTS = path.join(DATA, 'events.jsonl');

const DATA_FILES = ['company', 'products', 'contacts', 'finances', 'personal', 'projects', 'ideas', 'decisions', 'roadmap', 'settings', 'claude-sessions'];
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.md': 'text/markdown; charset=utf-8', '.ico': 'image/x-icon' };

function readJson(name) {
  const p = path.join(DATA, name + '.json');
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return { _error: String(e) }; }
}
function appendEvent(ev) {
  ev.ts = ev.ts || new Date().toISOString();
  fs.appendFileSync(EVENTS, JSON.stringify(ev) + '\n');
  return ev;
}
function body(req) {
  return new Promise((res, rej) => {
    let b = '';
    req.on('data', c => { b += c; if (b.length > 10e6) req.destroy(); });
    req.on('end', () => { try { res(b ? JSON.parse(b) : {}); } catch (e) { rej(e); } });
  });
}
function send(res, code, data, type = 'application/json') {
  const out = type === 'application/json' ? JSON.stringify(data) : data;
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(out);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  try {
    // ---- API ----
    if (p === '/api/data' && req.method === 'GET') {
      const all = {};
      for (const f of DATA_FILES) { const j = readJson(f); if (j) all[f] = j; }
      return send(res, 200, all);
    }
    if (p.startsWith('/api/data/') && req.method === 'PUT') {
      const name = p.split('/')[3].replace(/[^a-z-]/g, '');
      if (!DATA_FILES.includes(name)) return send(res, 400, { error: 'archivo no permitido' });
      const payload = await body(req);
      const prev = readJson(name);
      fs.writeFileSync(path.join(DATA, name + '.json'), JSON.stringify(payload.data, null, 2));
      appendEvent({ actor: payload.actor || 'pablo', type: 'save', section: name, detail: payload.detail || ('edición de ' + name), why: payload.why || null, prev });
      return send(res, 200, { ok: true });
    }
    if (p === '/api/event' && req.method === 'POST') {
      const ev = await body(req);
      return send(res, 200, appendEvent(ev));
    }
    if (p === '/api/events' && req.method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '200', 10);
      const lines = fs.existsSync(EVENTS) ? fs.readFileSync(EVENTS, 'utf8').trim().split('\n') : [];
      const start = Math.max(0, lines.length - limit);
      const evs = lines.slice(start).map((l, i) => { try { const e = JSON.parse(l); e._i = start + i; return e; } catch { return null; } }).filter(Boolean);
      return send(res, 200, { total: lines.length, events: evs.reverse() });
    }
    if (p === '/api/restore' && req.method === 'POST') {
      // restaura la versión 'prev' contenida en un evento de guardado (sin borrar nada)
      const { index } = await body(req);
      const lines = fs.readFileSync(EVENTS, 'utf8').trim().split('\n');
      const ev = JSON.parse(lines[index]);
      if (!ev || ev.type !== 'save' || !ev.prev) return send(res, 400, { error: 'ese evento no tiene versión anterior' });
      fs.writeFileSync(path.join(DATA, ev.section + '.json'), JSON.stringify(ev.prev, null, 2));
      appendEvent({ actor: 'pablo', type: 'restore', section: ev.section, detail: `restaurada versión anterior a ${ev.ts}` });
      return send(res, 200, { ok: true });
    }
    if (p === '/api/docs' && req.method === 'GET') {
      const files = fs.readdirSync(DOCS).filter(f => f.endsWith('.md'));
      return send(res, 200, { docs: files });
    }
    if (p.startsWith('/api/docs/') && req.method === 'GET') {
      const name = decodeURIComponent(p.split('/')[3]).replace(/[^a-z0-9-.]/gi, '');
      const fp = path.join(DOCS, name);
      if (!fs.existsSync(fp)) return send(res, 404, { error: 'no existe' });
      return send(res, 200, fs.readFileSync(fp, 'utf8'), 'text/markdown; charset=utf-8');
    }
    if (p === '/api/git-sync' && req.method === 'POST') {
      const repo = path.join(ROOT, '..');
      execFile('git', ['add', 'hq/data'], { cwd: repo }, () => {
        execFile('git', ['commit', '-m', 'hq: sync de datos y decisiones de Pablo'], { cwd: repo }, (e, so, se) => {
          if (e && !/nothing to commit/.test(so + se)) return send(res, 500, { error: se || String(e) });
          execFile('git', ['push'], { cwd: repo }, (e2, so2, se2) => {
            if (e2) return send(res, 200, { ok: true, pushed: false, note: 'Commit hecho; push falló (¿sin red/credenciales?): ' + (se2 || '').slice(0, 200) });
            send(res, 200, { ok: true, pushed: true });
          });
        });
      });
      return;
    }
    // ---- estáticos ----
    let file = p === '/' ? '/index.html' : p;
    const fp = path.normalize(path.join(PUB, file));
    if (fp.startsWith(PUB) && fs.existsSync(fp) && fs.statSync(fp).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      return fs.createReadStream(fp).pipe(res);
    }
    // SPA fallback
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(path.join(PUB, 'index.html')).pipe(res);
  } catch (e) {
    send(res, 500, { error: String(e) });
  }
});

server.listen(PORT, () => {
  console.log(`\n  Canicarbon HQ  →  http://localhost:${PORT}\n`);
  console.log('  Datos:   hq/data/*.json   (editables, versionados en events.jsonl)');
  console.log('  Sync:    botón "Sincronizar con Claude" en Ajustes, o git push manual\n');
});
