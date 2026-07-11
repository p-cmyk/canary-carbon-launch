#!/usr/bin/env node
/**
 * Indexa las sesiones locales de Claude Code (~/.claude/projects/<proyecto>/*.jsonl)
 * y escribe un resumen en hq/data/claude-sessions.json para que la interfaz HQ
 * (y Claude, tras un push) puedan verlas.
 *
 * Uso, en el PC donde vive Claude Code (p.ej. el de Tenerife):
 *   node tools/claude-sessions-export.mjs
 *   git add hq/data/claude-sessions.json && git commit -m "hq: sesiones claude" && git push
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const base = join(homedir(), '.claude', 'projects');
const out = { generatedAt: new Date().toISOString(), host: process.env.COMPUTERNAME || process.env.HOSTNAME || 'desconocido', sessions: [] };

if (!existsSync(base)) {
  console.error('No existe ' + base + ' — ¿está instalado Claude Code en este equipo?');
} else {
  for (const proj of readdirSync(base)) {
    const dir = join(base, proj);
    let files = [];
    try { files = readdirSync(dir).filter(f => f.endsWith('.jsonl')); } catch { continue; }
    for (const f of files) {
      const fp = join(dir, f);
      try {
        const st = statSync(fp);
        const lines = readFileSync(fp, 'utf8').trim().split('\n');
        // primer mensaje de usuario como título aproximado
        let title = '';
        for (const l of lines) {
          try {
            const j = JSON.parse(l);
            const c = j?.message?.content;
            if (j.type === 'user' && c) {
              title = (typeof c === 'string' ? c : (Array.isArray(c) ? c.map(x => x.text || '').join(' ') : '')).slice(0, 140).replace(/\s+/g, ' ').trim();
              if (title) break;
            }
          } catch {}
        }
        out.sessions.push({ project: proj.replace(/^-/, '').replace(/-/g, '/'), file: f, title, messages: lines.length, mtime: st.mtime.toISOString().slice(0, 16).replace('T', ' ') });
      } catch {}
    }
  }
  out.sessions.sort((a, b) => b.mtime.localeCompare(a.mtime));
  out.sessions = out.sessions.slice(0, 200);
}
writeFileSync(new URL('../hq/data/claude-sessions.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(`Indexadas ${out.sessions.length} sesiones → hq/data/claude-sessions.json`);
