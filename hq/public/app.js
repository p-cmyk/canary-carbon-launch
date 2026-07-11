/* ============ Canicarbon HQ — aplicación ============
   Vanilla JS, sin build. Todo cambio del usuario:
   1) muta S.data  2) PUT al servidor  3) evento en events.jsonl
   4) ventanita "¿por qué?" opcional → evento 'why'.
   Claude lee esos eventos en cada sesión (docs/protocolo-agente.md). */
'use strict';

const S = {
  data: null, route: 'panel', deckIdx: 0, slideIdx: 0,
  readonly: false, ideasFolder: null, contactsGroup: null,
  scenario: 'puertos', docOpen: null, events: [], eventsTotal: 0
};
const $ = s => document.querySelector(s);
const app = $('#app');
const fmt = new Intl.NumberFormat('es-ES');
const eur = n => (n == null ? '—' : fmt.format(n) + ' €');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const today = () => new Date().toISOString().slice(0, 10);

/* ---------- API ---------- */
async function api(path, opts) {
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.headers.get('content-type')?.includes('json') ? r.json() : r.text();
}
async function loadAll() {
  try {
    S.data = await api('/api/data');
    localStorage.setItem('hq-cache', JSON.stringify(S.data));
  } catch (e) {
    const cache = localStorage.getItem('hq-cache');
    if (cache) { S.data = JSON.parse(cache); S.readonly = true; }
    else { $('.boot-msg').textContent = ''; $('.boot-help').hidden = false; throw e; }
  }
}
async function save(name, detail, why) {
  if (S.readonly) return toast('Modo lectura: arranca el servidor para guardar');
  try {
    await api('/api/data/' + name, { method: 'PUT', body: JSON.stringify({ data: S.data[name], detail, why: why || null, actor: 'pablo' }) });
    localStorage.setItem('hq-cache', JSON.stringify(S.data));
  } catch (e) { toast('Error al guardar: ' + e.message); }
}
function logEvent(type, section, detail, payload) {
  if (S.readonly) return;
  api('/api/event', { method: 'POST', body: JSON.stringify({ actor: 'pablo', type, section, detail, payload: payload || null }) }).catch(() => {});
}

/* ---------- UI helpers ---------- */
function toast(msg, ms = 2600) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), ms);
}
/* Ventanita "¿por qué?" — opcional, no bloquea */
function askWhy(section, detail) {
  document.querySelectorAll('.whybar').forEach(t => t.remove());
  const bar = document.createElement('div');
  bar.className = 'whybar';
  bar.innerHTML = `<span style="font-size:.85em;color:var(--faint)">¿Por qué?</span>
    <input placeholder="motivo (opcional — Claude lo leerá)" maxlength="300">
    <button class="btn primary" style="padding:.45em .9em">OK</button>`;
  document.body.appendChild(bar);
  const input = bar.querySelector('input');
  const submit = () => {
    if (input.value.trim()) logEvent('why', section, detail, { why: input.value.trim() });
    bar.remove();
  };
  bar.querySelector('button').onclick = submit;
  input.onkeydown = e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') bar.remove(); };
  setTimeout(() => { if (document.body.contains(bar)) bar.remove(); }, 12000);
  input.focus();
}
function modal(html, onMount) {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="modal">${html}</div>`;
  ov.onclick = e => { if (e.target === ov) ov.remove(); };
  document.body.appendChild(ov);
  if (onMount) onMount(ov);
  return ov;
}

/* ---------- gráficas SVG ---------- */
function lineChart(series, labels, opts = {}) {
  const W = 720, H = 260, P = 42;
  let min = 0, max = -Infinity;
  series.forEach(s => s.points.forEach(v => { min = Math.min(min, v); max = Math.max(max, v); }));
  if (max === -Infinity) max = 1;
  const span = (max - min) || 1;
  const X = i => P + i * (W - P - 14) / Math.max(1, labels.length - 1);
  const Y = v => H - 30 - (v - min) * (H - 55) / span;
  let grid = '', axis = '';
  for (let g = 0; g <= 4; g++) {
    const v = min + span * g / 4, y = Y(v);
    grid += `<line x1="${P}" y1="${y}" x2="${W - 14}" y2="${y}" stroke="rgba(255,255,255,.06)"/>`;
    axis += `<text x="4" y="${y + 4}">${fmt.format(Math.round(v / 1000))}k</text>`;
  }
  const lbl = labels.map((l, i) => (i % Math.ceil(labels.length / 8) === 0) ? `<text x="${X(i)}" y="${H - 8}" text-anchor="middle">${l.slice(2)}</text>` : '').join('');
  const paths = series.map(s => {
    const pts = s.points.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
    const area = opts.area ? `<polygon points="${X(0)},${Y(min)} ${pts} ${X(s.points.length - 1)},${Y(min)}" fill="${s.color}18"/>` : '';
    return `${area}<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="3" stroke-linejoin="round"/>` +
      s.points.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" fill="${s.color}"/>`).join('');
  }).join('');
  let marker = '';
  if (opts.marker && labels.includes(opts.marker.month)) {
    const i = labels.indexOf(opts.marker.month);
    marker = `<line x1="${X(i)}" y1="18" x2="${X(i)}" y2="${H - 30}" stroke="#f0b429" stroke-dasharray="5 4" stroke-width="2"/>
      <text x="${X(i)}" y="14" text-anchor="middle" style="fill:#f0b429;font-weight:700">${esc(opts.marker.label || '')}</text>`;
  }
  const zero = (min < 0) ? `<line x1="${P}" y1="${Y(0)}" x2="${W - 14}" y2="${Y(0)}" stroke="rgba(245,101,101,.5)" stroke-width="1.5"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" data-chart="1">${grid}${axis}${zero}${paths}${marker}${lbl}</svg>`;
}
function donut(items) {
  const C = 70, R = 52, SW = 22; let acc = 0;
  const segs = items.map(it => {
    const a0 = acc / 100 * 2 * Math.PI - Math.PI / 2; acc += it.pct;
    const a1 = acc / 100 * 2 * Math.PI - Math.PI / 2;
    const large = it.pct > 50 ? 1 : 0;
    return `<path d="M ${C + R * Math.cos(a0)} ${C + R * Math.sin(a0)} A ${R} ${R} 0 ${large} 1 ${C + R * Math.cos(a1)} ${C + R * Math.sin(a1)}" fill="none" stroke="${it.color}" stroke-width="${SW}"/>`;
  }).join('');
  return `<svg viewBox="0 0 140 140" style="max-width:190px" class="chart">${segs}<text x="70" y="74" text-anchor="middle" style="fill:#e8edf5;font-size:20px;font-weight:800">${items[0].pct}%</text></svg>`;
}

/* ---------- markdown mínimo ---------- */
function md(src) {
  const lines = src.split('\n'); let out = '', inTable = false, inList = false, inCode = false;
  const inline = t => esc(t)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
  for (const l of lines) {
    if (l.startsWith('```')) { inCode = !inCode; out += inCode ? '<pre style="background:rgba(0,0,0,.35);padding:12px;border-radius:10px;font-size:.85em;overflow:auto">' : '</pre>'; continue; }
    if (inCode) { out += esc(l) + '\n'; continue; }
    if (/^\|/.test(l)) {
      if (/^\|[\s:-]+\|/.test(l.replace(/[^|:\s-]/g, ''))) { if (/^[\s|:-]+$/.test(l)) continue; }
      const cells = l.split('|').slice(1, -1).map(c => inline(c.trim()));
      if (!inTable) { out += '<div class="tblwrap"><table class="t"><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr>'; inTable = true; }
      else out += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      continue;
    } else if (inTable) { out += '</table></div>'; inTable = false; }
    if (/^\s*[-*] /.test(l)) { if (!inList) { out += '<ul style="padding-left:1.2em;margin:.4em 0">'; inList = true; } out += `<li>${inline(l.replace(/^\s*[-*] /, ''))}</li>`; continue; }
    else if (/^\s*\d+\. /.test(l)) { if (!inList) { out += '<ol style="padding-left:1.2em;margin:.4em 0">'; inList = true; } out += `<li>${inline(l.replace(/^\s*\d+\. /, ''))}</li>`; continue; }
    else if (inList) { out += '</ul>'; inList = false; }
    if (/^### /.test(l)) out += `<h4 style="margin:.9em 0 .3em">${inline(l.slice(4))}</h4>`;
    else if (/^## /.test(l)) out += `<h3 style="margin:1em 0 .35em;color:var(--accent)">${inline(l.slice(3))}</h3>`;
    else if (/^# /.test(l)) out += `<h2 style="margin:.4em 0 .5em;font-size:var(--fs-2)">${inline(l.slice(2))}</h2>`;
    else if (/^⚠️|^\*\*⚠️/.test(l)) out += `<p style="border-left:3px solid var(--gold);padding-left:10px;color:var(--gold)">${inline(l)}</p>`;
    else if (l.trim() === '') out += '';
    else out += `<p style="margin:.45em 0;color:var(--dim)">${inline(l)}</p>`;
  }
  if (inTable) out += '</table></div>';
  if (inList) out += '</ul>';
  return out;
}

/* ---------- navegación ---------- */
const NAV = [
  ['panel', '◈', 'Panel'], ['decisiones', '▣', 'Decisiones'], ['ideas', '✦', 'Ideas'],
  ['empresa', '◆', 'Empresa'], ['producto', '⬢', 'Producto'], ['contactos', '◉', 'Contactos'],
  ['finanzas', '𝄜', 'Finanzas'], ['perfil', '☉', 'Perfil'], ['roadmap', '⇶', 'Roadmap'],
  ['proyectos', '❖', 'Proyectos'], ['docs', '☰', 'Docs'], ['presentacion', '▷', 'Presentación'],
  ['registro', '≣', 'Registro'], ['ajustes', '⚙', 'Ajustes']
];
const MOBILE_NAV = ['panel', 'decisiones', 'ideas', 'perfil', 'presentacion'];

function shell(content) {
  const pend = S.data.decisions.decisions.filter(d => d.status === 'pendiente').length;
  const dev = S.data.settings.devMode;
  return `
  <nav class="sidebar">
    <div class="side-logo">CANICARBON <span>HQ</span></div>
    ${NAV.map(([r, ico, name]) => `<button class="nav-btn ${S.route === r ? 'active' : ''}" data-nav="${r}">
      <span class="ico">${ico}</span>${name}${r === 'decisiones' && pend ? `<span class="nav-badge">${pend}</span>` : ''}</button>`).join('')}
    <div class="side-foot">${S.readonly ? '⚠️ modo lectura (sin servidor)' : '● conectado en local'}<br>Los cambios quedan registrados<br>y Claude los lee al sincronizar.</div>
  </nav>
  <main data-file="${S.route}">${content}</main>
  <div class="bottombar">
    ${MOBILE_NAV.map(r => { const n = NAV.find(x => x[0] === r); return `<button class="${S.route === r ? 'active' : ''}" data-nav="${r}"><span class="ico">${n[1]}</span>${n[2]}</button>`; }).join('')}
    <button data-nav="__more"><span class="ico">⋯</span>Más</button>
  </div>`;
}
function head(title, sub, file) {
  const dev = S.data.settings.devMode ? `<span class="devchip">hq/data/${file || S.route}.json</span>` : '';
  return `<div class="page-head"><h1>${title}${dev}</h1><span class="sub">${sub || ''}</span></div>`;
}

/* ---------- páginas ---------- */
function pagePanel() {
  const c = S.data.company, pend = S.data.decisions.decisions.filter(d => d.status === 'pendiente');
  const next = c.milestones.find(m => m.status !== 'hecho');
  const daysTo = d => Math.ceil((new Date(d) - Date.now()) / 864e5);
  const ideas = S.data.ideas.ideas;
  return head('Buenas, Pablo', new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })) + `
  <div class="grid cols-3">
    <div class="card glass" style="cursor:pointer" data-nav="decisiones">
      <div class="kicker">Decisiones pendientes</div>
      <div class="big-num">${pend.length}</div>
      <p>${pend[0] ? 'Siguiente: ' + esc(pend[0].title) : 'Todo decidido ✓'}</p>
      <br><button class="btn primary big">Decidir ahora →</button>
    </div>
    <div class="card">
      <div class="kicker">Próximo hito</div>
      <h3 style="font-size:var(--fs-2)">${esc(next?.title || '—')}</h3>
      <p>${next ? next.date + ' · en ' + daysTo(next.date) + ' días' : ''}</p>
      <hr class="sep">
      <div class="kicker">Resolución Puertos 4.0</div>
      <div class="big-num" style="font-size:var(--fs-3)">${daysTo('2026-11-30')} días</div>
    </div>
    <div class="card">
      <div class="kicker">Financiación</div>
      ${c.funding.map(f => `<div class="row spread" style="margin-bottom:8px"><span style="font-size:var(--fs-0)">${esc(f.name.split('·')[0].split('(')[0])}</span>
        <span class="status ${f.status.replace(/[^a-z]/g, '')}">${f.status}</span></div>`).join('')}
      <hr class="sep">
      <p>Ideas: <b>${ideas.filter(i => !i.done).length}</b> abiertas · <b>${ideas.filter(i => i.done).length}</b> hechas</p>
    </div>
  </div>
  <br>
  <div class="grid cols-2">
    <div class="card">
      <div class="kicker">Nota para Claude (la leo en cada sesión)</div>
      <textarea id="noteclaude" rows="3">${esc(S.data.settings.notesToClaude)}</textarea>
      <br><br><button class="btn" id="savenote">Guardar nota</button>
    </div>
    <div class="card">
      <div class="kicker">Cómo trabajamos</div>
      <p>1 · Marca decisiones y edita fichas aquí.<br>2 · Pulsa <b>Sincronizar con Claude</b> (Ajustes) o haz push.<br>3 · Dime <b>«avanza»</b> en el chat: leo todo lo que marcaste, lo ejecuto, mejoro la interfaz y te dejo tarjetas nuevas.</p>
      <br><div class="row">
        <button class="btn" data-nav="presentacion">▷ Modo TV</button>
        <button class="btn" data-nav="registro">≣ Registro completo</button>
      </div>
    </div>
  </div>`;
}

function pageDecisiones() {
  const list = S.data.decisions.decisions;
  const pend = list.filter(d => d.status === 'pendiente');
  if (!pend.length) {
    return head('Decisiones', 'todo decidido') + `<div class="card glass deck" style="text-align:center">
      <h3>No hay decisiones pendientes ✓</h3><p>Sincroniza y dime «avanza» en el chat: prepararé las siguientes.</p></div>` + decidedHistory(list);
  }
  if (S.deckIdx >= pend.length) S.deckIdx = 0;
  const d = pend[S.deckIdx];
  const scopeColors = { empresa: 'var(--accent2)', producto: 'var(--green)', interfaz: 'var(--violet)', personal: 'var(--red)', rafi: 'var(--violet)', voicenotes: 'var(--gold)' };
  return head('Decisiones', `${pend.length} pendientes`, 'decisions') + `
  <div class="deck">
    <div class="deck-counter">DECISIÓN ${S.deckIdx + 1} DE ${pend.length} · pulsa 1-9 para elegir</div>
    <div class="card glass dcard">
      <span class="scope" style="color:${scopeColors[d.scope] || 'var(--accent)'}">${esc(d.scope)} · ${d.type === 'info' ? 'para leer' : d.type === 'question' ? 'te pregunto' : 'a decidir'}</span>
      <h2>${esc(d.title)}</h2>
      <div class="body">${esc(d.body)}</div>
      <div class="opts">
        ${(d.options || []).map((o, i) => `<button class="opt" data-opt="${o.id}">
          <span class="key">${i + 1}</span><span class="ol">${esc(o.label)}</span>
          <div class="od">${esc(o.detail || '')}</div></button>`).join('')}
      </div>
      ${d.allowText ? `<br><textarea id="dtext" rows="2" placeholder="…o escríbeme aquí tu respuesta / matiz / contexto"></textarea>
      <br><br><button class="btn" id="dtextsend">Enviar respuesta escrita</button>` : ''}
    </div>
    <div class="dnav">
      <button class="btn ghost" id="dprev">← anterior</button>
      <button class="btn ghost" id="dskip">saltar por ahora →</button>
    </div>
  </div>` + decidedHistory(list);
}
function decidedHistory(list) {
  const done = list.filter(d => d.status !== 'pendiente');
  if (!done.length) return '';
  return `<br><div class="page-head"><h1 style="font-size:var(--fs-2)">Decididas</h1></div>` +
    done.map(d => `<div class="lrow done" style="cursor:default"><div class="checkbox">✓</div>
      <div class="t"><b>${esc(d.title)}</b><small>${d.decidedAt || ''} · ${esc(d.answer?.label || d.answer?.text || '')} ${d.reason ? '· «' + esc(d.reason) + '»' : ''}</small></div></div>`).join('');
}

function pageIdeas() {
  const { folders, ideas } = S.data.ideas;
  const list = ideas.filter(i => !S.ideasFolder || i.folder === S.ideasFolder);
  return head('Ideas', `${ideas.filter(i => !i.done).length} abiertas`, 'ideas') + `
  <div class="folder-chips">
    <button class="chip ${!S.ideasFolder ? 'on' : ''}" data-folder="">Todas</button>
    ${folders.map(f => `<button class="chip ${S.ideasFolder === f.id ? 'on' : ''}" data-folder="${f.id}" style="color:${S.ideasFolder === f.id ? f.color : ''}"><span class="dot" style="background:${f.color}"></span>${esc(f.name)}</button>`).join('')}
    <button class="btn primary" id="addidea" style="margin-left:auto">+ Nueva idea</button>
  </div>
  ${list.sort((a, b) => (a.done - b.done) || b.date.localeCompare(a.date)).map(i => {
    const f = folders.find(x => x.id === i.folder);
    return `<div class="lrow ${i.done ? 'done' : ''}" data-idea="${i.id}">
      <div class="checkbox" data-check="${i.id}">${i.done ? '✓' : ''}</div>
      <div class="t"><b>${esc(i.title)}</b><small>${i.date} · <span style="color:${f?.color}">${esc(f?.name || '')}</span>${i.notes ? ' · ' + esc(i.notes.slice(0, 90)) : ''}</small></div>
      <span class="status ${i.status.replace(/ /g, '')}">${i.status}</span></div>`;
  }).join('') || '<p class="muted">Sin ideas en esta carpeta.</p>'}`;
}
function ideaModal(idea) {
  const isNew = !idea;
  const i = idea || { id: 'id' + Date.now(), title: '', folder: S.ideasFolder || 'canicarbon', status: 'pendiente', notes: '', date: today(), done: false };
  modal(`<h3>${isNew ? 'Nueva idea' : 'Editar idea'}</h3>
    <div class="field"><label>Título</label><input id="m-title" value="${esc(i.title)}"></div>
    <div class="field"><label>Carpeta</label><select id="m-folder">${S.data.ideas.folders.map(f => `<option value="${f.id}" ${f.id === i.folder ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}</select></div>
    <div class="field"><label>Estado</label><select id="m-status">${['pendiente', 'en curso', 'hecho'].map(s => `<option ${s === i.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
    <div class="field"><label>Notas</label><textarea id="m-notes" rows="4">${esc(i.notes)}</textarea></div>
    <div class="row spread"><button class="btn primary" id="m-save">Guardar</button><span class="faint" style="font-size:.75em">${i.date}</span></div>`,
    ov => {
      ov.querySelector('#m-save').onclick = async () => {
        i.title = ov.querySelector('#m-title').value.trim() || '(sin título)';
        i.folder = ov.querySelector('#m-folder').value;
        i.status = ov.querySelector('#m-status').value;
        i.done = i.status === 'hecho';
        i.notes = ov.querySelector('#m-notes').value;
        if (isNew) S.data.ideas.ideas.push(i);
        await save('ideas', (isNew ? 'nueva idea: ' : 'idea editada: ') + i.title);
        logEvent('idea', 'ideas', (isNew ? 'creada' : 'editada') + ': ' + i.title);
        ov.remove(); render(); askWhy('ideas', i.title);
      };
    });
}

function pageEmpresa() {
  const c = S.data.company;
  return head(c.name, c.tagline, 'company') + `
  <div class="grid cols-2">
    <div class="card">
      <div class="kicker">Reparto de la sociedad</div>
      <div class="row" style="gap:24px">
        ${donut(c.capTable.map(s => ({ pct: s.pct, color: s.color })))}
        <div>${c.capTable.map(s => `<div style="margin-bottom:10px"><span class="chip" style="color:${s.color}"><span class="dot"></span>${s.pct}%</span> <b style="font-size:var(--fs-0)">${esc(s.name)}</b><br><small class="faint">${esc(s.role)}</small></div>`).join('')}</div>
      </div>
    </div>
    <div class="card">
      <div class="kicker">Hitos</div>
      <div class="tl">${c.milestones.map(m => `<div class="tl-item" style="--c:${m.status === 'hecho' ? 'var(--green)' : m.status === 'en curso' ? 'var(--accent2)' : 'var(--line2)'}">
        <div class="d">${m.date}</div><div class="tt">${esc(m.title)} <span class="status ${m.status.replace(/ /g, '')}">${m.status}</span></div></div>`).join('')}</div>
    </div>
  </div><br>
  <div class="grid cols-3">
    ${c.funding.map(f => `<div class="card glass">
      <div class="kicker">${esc(f.type)}</div>
      <h3 style="font-size:var(--fs-1)">${esc(f.name)}</h3>
      <div class="big-num" style="font-size:var(--fs-3)">${f.amount ? eur(f.amount) : '—'}</div>
      <p><span class="status ${f.status.replace(/[^a-z]/g, '')}">${f.status}</span> ${f.resolution ? ' · resolución ' + f.resolution : ''}
      ${f.probability != null ? ' · prob. estimada ' + Math.round(f.probability * 100) + '%' : ''}</p>
      <hr class="sep"><p style="font-size:.85em">${esc(f.notes)}</p></div>`).join('')}
  </div>`;
}

function pageProducto() {
  const P = S.data.products;
  return head('Producto', 'sistema modular de techo · CC-Air + HR-01', 'products') + `
  <div class="grid cols-2">
    ${P.products.map(p => `<div class="card glass">
      <div class="kicker">${p.status}</div>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.concept)}</p>
      <hr class="sep">
      <div class="tblwrap"><table class="t">${Object.entries(p.targetSpecs).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table></div>
      <hr class="sep">
      <div class="kicker">Coste estimado (BOM)</div>
      <div class="tblwrap"><table class="t">${p.bom.map(b => `<tr><td>${esc(b.item)}</td><td>${eur(b.cost)}</td></tr>`).join('')}
        <tr><td><b>Total BOM</b></td><td><b>${eur(p.pricing.bomTotal)}</b></td></tr>
        <tr><td><b>PVP objetivo</b></td><td><b style="color:var(--accent)">${eur(p.pricing.targetPvp)}</b> + ${eur(p.pricing.recambioAnual)}/año consumible</td></tr></table></div>
      <p style="font-size:.85em;margin-top:8px">${esc(p.pricing.margen)}</p>
      <hr class="sep">
      <div class="kicker">Go to market</div><p>${esc(p.gtm)}</p>
      <div class="kicker" style="margin-top:10px">Riesgos</div>
      <ul style="padding-left:1.2em">${p.risks.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    </div>`).join('')}
  </div><br>
  <div class="card">
    <div class="kicker">Por qué existe el mercado (normativa)</div>
    <p>${esc(P.regulation.summary)}</p>
    <div class="row" style="margin-top:8px">${P.regulation.sources.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>
  </div><br>
  <div class="card">
    <div class="kicker">Competencia y referentes</div>
    <div class="tblwrap"><table class="t"><tr><th>Empresa</th><th>Qué hace</th><th>Amenaza</th><th>Qué aprendemos</th></tr>
    ${P.competitors.map(c => `<tr><td>${esc(c.name)}<br><small class="faint">${esc(c.country)}</small></td><td>${esc(c.focus)}</td><td>${esc(c.threat)}</td><td>${esc(c.learn)}</td></tr>`).join('')}</table></div>
  </div><br>
  <div class="row">
    <a class="btn big" href="landing.html" target="_blank">☁️ Ver landing del producto</a>
    <button class="btn" data-nav="docs">☰ Dossier completo en Docs</button>
  </div>`;
}

function pageContactos() {
  const { groups, contacts } = S.data.contacts;
  const list = contacts.filter(c => !S.contactsGroup || c.group === S.contactsGroup);
  return head('Contactos', 'personas, empresas y grupos de interés', 'contacts') + `
  <div class="folder-chips">
    <button class="chip ${!S.contactsGroup ? 'on' : ''}" data-group="">Todos</button>
    ${groups.map(g => `<button class="chip ${S.contactsGroup === g.id ? 'on' : ''}" data-group="${g.id}" style="color:${S.contactsGroup === g.id ? g.color : ''}"><span class="dot" style="background:${g.color}"></span>${esc(g.name)}</button>`).join('')}
    <button class="btn primary" id="addcontact" style="margin-left:auto">+ Contacto</button>
  </div>
  ${S.contactsGroup ? `<p class="muted" style="margin-bottom:12px">${esc(groups.find(g => g.id === S.contactsGroup)?.desc || '')}</p>` : ''}
  ${list.map(c => {
    const g = groups.find(x => x.id === c.group);
    return `<div class="lrow" data-contact="${c.id}">
      <span style="width:1em;height:2.2em;border-radius:4px;background:${g?.color};flex:none"></span>
      <div class="t"><b>${esc(c.name)}</b><small>${esc(c.person)} · ${esc(c.role)} ${c.money ? '· 💶 ' + esc(c.money) : ''}</small></div>
      <span class="chip" style="color:${g?.color}">${esc(g?.name.split('/')[0] || '')}</span></div>`;
  }).join('') || '<p class="muted">Sin contactos en este grupo.</p>'}`;
}
function contactModal(contact) {
  const isNew = !contact;
  const c = contact || { id: 'c' + Date.now(), name: '', person: '', role: '', group: S.contactsGroup || 'cliente', company: '', money: '', notes: '', links: [] };
  modal(`<h3>${isNew ? 'Nuevo contacto' : esc(c.name)}</h3>
    <div class="field"><label>Nombre / entidad</label><input id="m-name" value="${esc(c.name)}"></div>
    <div class="field"><label>Persona de contacto</label><input id="m-person" value="${esc(c.person)}"></div>
    <div class="field"><label>Cargo / rol</label><input id="m-role" value="${esc(c.role)}"></div>
    <div class="field"><label>Grupo de interés</label><select id="m-group">${S.data.contacts.groups.map(g => `<option value="${g.id}" ${g.id === c.group ? 'selected' : ''}>${esc(g.name)}</option>`).join('')}</select></div>
    <div class="field"><label>Dinero / relación económica</label><input id="m-money" value="${esc(c.money)}"></div>
    <div class="field"><label>Notas (conexiones con otras personas/empresas)</label><textarea id="m-notes" rows="3">${esc(c.notes)}</textarea></div>
    <button class="btn primary" id="m-save">Guardar</button>`,
    ov => {
      ov.querySelector('#m-save').onclick = async () => {
        c.name = ov.querySelector('#m-name').value.trim() || '(sin nombre)';
        c.person = ov.querySelector('#m-person').value; c.role = ov.querySelector('#m-role').value;
        c.group = ov.querySelector('#m-group').value; c.money = ov.querySelector('#m-money').value;
        c.notes = ov.querySelector('#m-notes').value;
        if (isNew) S.data.contacts.contacts.push(c);
        await save('contacts', (isNew ? 'nuevo contacto: ' : 'contacto editado: ') + c.name);
        logEvent('edit', 'contacts', (isNew ? 'creado' : 'editado') + ': ' + c.name);
        ov.remove(); render();
      };
    });
}

function pageFinanzas() {
  const F = S.data.finances;
  const sc = F.scenarios.find(s => s.id === S.scenario) || F.scenarios[0];
  let acc = 0; const cum = sc.monthly.map(m => (acc += m.in - m.out));
  const labels = sc.monthly.map(m => m.month);
  return head('Finanzas de la empresa', 'escenarios y presupuesto', 'finances') + `
  <div class="folder-chips">${F.scenarios.map(s => `<button class="chip ${S.scenario === s.id ? 'on' : ''}" data-scenario="${s.id}">${esc(s.name)}</button>`).join('')}</div>
  <div class="card glass">
    <div class="kicker">Caja acumulada · ${esc(sc.name)}</div>
    ${lineChart([{ color: '#4fd1c5', points: cum }], labels, { area: true })}
    <div class="legend"><span><i style="background:#4fd1c5"></i>caja acumulada (€)</span></div>
    <p style="margin-top:8px">${esc(sc.desc)} ${esc(sc.note)}</p>
  </div><br>
  <div class="grid cols-2">
    <div class="card">
      <div class="kicker">Entradas y salidas mensuales</div>
      <div class="tblwrap"><table class="t"><tr><th>Mes</th><th>Entra</th><th>Sale</th><th>Neto</th></tr>
      ${sc.monthly.map(m => `<tr><td>${m.month}</td><td style="color:var(--green)">${m.in ? '+' + fmt.format(m.in) : '—'}</td><td style="color:var(--red)">−${fmt.format(m.out)}</td><td>${fmt.format(m.in - m.out)}</td></tr>`).join('')}</table></div>
    </div>
    <div class="card">
      <div class="kicker">Presupuesto por partidas</div>
      <div class="tblwrap"><table class="t"><tr><th>Partida</th><th>Importe</th><th>Fase</th></tr>
      ${F.budgetLines.map(b => `<tr><td>${esc(b.concept)}</td><td>${eur(b.annual)}</td><td>${esc(b.phase)}</td></tr>`).join('')}
      <tr><td><b>Total</b></td><td colspan="2"><b>${eur(F.budgetLines.reduce((a, b) => a + b.annual, 0))}</b></td></tr></table></div>
    </div>
  </div>`;
}

function pagePerfil() {
  const P = S.data.personal;
  const inc = P.monthly.incomes.reduce((a, i) => a + i.amount, 0);
  const exp = P.monthly.expenses.reduce((a, e) => a + e.amount, 0);
  const net = inc - exp;
  const months = []; const d0 = new Date();
  for (let i = 0; i < 14; i++) { const d = new Date(d0.getFullYear(), d0.getMonth() + i, 1); months.push(d.toISOString().slice(0, 7)); }
  const mk = P.projection.marker;
  const proj = months.map((m, i) => {
    let extra = 0;
    if (mk && m >= mk.month) extra = (mk.amount || 0) * (months.indexOf(m) - months.indexOf(mk.month) + 1);
    return P.monthly.savings + net * i + extra;
  });
  const riskText = v => v < 25 ? 'Riesgo bajo: exposición controlada.' : v < 55 ? 'Riesgo medio: vigilar compromisos y no firmar avales.' : v < 80 ? 'Riesgo alto: hay dinero/tiempo serio en juego; decisiones por escrito.' : 'Riesgo crítico: no avanzar sin asesoría independiente.';
  const satText = v => v < 30 ? 'Te está drenando. ¿Merece seguir?' : v < 60 ? 'Neutro: revisa si el esfuerzo compensa.' : 'Te da energía: protege este proyecto en tu agenda.';
  return head('Perfil · Pablo', 'tu dinero, tu riesgo, tu energía', 'personal') + `
  <div class="grid cols-3">
    <div class="card"><div class="kicker">Balance mensual</div><div class="big-num" style="font-size:var(--fs-3);color:${net >= 0 ? 'var(--green)' : 'var(--red)'}">${net >= 0 ? '+' : ''}${fmt.format(net)} €</div>
      <p>${fmt.format(inc)} € entran · ${fmt.format(exp)} € salen</p></div>
    <div class="card"><div class="kicker">Ahorros</div><div class="big-num" style="font-size:var(--fs-3)">${eur(P.monthly.savings)}</div>
      <p>runway ${net < 0 ? Math.floor(P.monthly.savings / -net) + ' meses' : '∞ (balance positivo)'}</p></div>
    <div class="card"><div class="kicker">Seguridad global</div><p style="font-size:.9em">${esc(P.securityAnalysis)}</p></div>
  </div><br>
  <div class="card glass">
    <div class="kicker">Proyección de caja personal · toca la gráfica para mover el marcador</div>
    <div id="projchart">${lineChart([{ color: '#5b8def', points: proj }], months, { area: true, marker: mk ? { month: mk.month, label: '⚑' } : null })}</div>
    <div class="row" style="margin-top:8px">
      <span class="chip" style="color:var(--gold)"><span class="dot"></span>⚑ ${esc(mk.label)}</span>
      <label style="width:auto;font-size:.85em;color:var(--dim)">desde <b>${mk.month}</b>, +</label>
      <input id="mkamount" type="number" value="${mk.amount}" style="width:110px"> €/mes
      <button class="btn" id="mksave">Guardar marcador</button>
    </div>
  </div><br>
  <div class="grid cols-2">
    <div class="card">
      <div class="kicker">Ingresos y gastos (toca importe para editar)</div>
      <div class="tblwrap"><table class="t">
      ${P.monthly.incomes.map(i => `<tr><td>${esc(i.name)}</td><td><button class="btn ghost" data-editmoney="incomes:${i.id}" style="color:var(--green)">+${fmt.format(i.amount)} €</button></td></tr>`).join('')}
      ${P.monthly.expenses.map(e => `<tr><td>${esc(e.name)}</td><td><button class="btn ghost" data-editmoney="expenses:${e.id}" style="color:var(--red)">−${fmt.format(e.amount)} €</button></td></tr>`).join('')}
      </table></div>
    </div>
    <div class="card">
      <div class="kicker">Impuestos y cómo te afecta cada negocio</div>
      ${P.businessStakes.map(b => `<details style="margin-bottom:10px"><summary style="cursor:pointer;font-size:var(--fs-0)"><b>${esc(b.name)}</b></summary>
        <p style="font-size:.85em;margin-top:6px">${esc(b.taxNote)}</p>
        <p style="font-size:.85em;color:var(--gold)">Ingresos previstos: ${esc(b.expectedIncome)}</p></details>`).join('')}
    </div>
  </div><br>
  <div class="card">
    <div class="kicker">Riesgo y satisfacción por negocio (mueve y guarda — explico el efecto en vivo)</div>
    ${P.businessStakes.map(b => `
      <div style="margin-bottom:20px">
        <b style="font-size:var(--fs-0)">${esc(b.name)}</b>
        <div class="sliderline"><label><span>Riesgo</span><span id="rv-${b.id}">${b.risk}</span></label>
          <input type="range" min="0" max="100" value="${b.risk}" data-slider="risk:${b.id}">
          <div class="slider-note" id="rn-${b.id}">${riskText(b.risk)}</div></div>
        <div class="sliderline"><label><span>Satisfacción</span><span id="sv-${b.id}">${b.satisfaction}</span></label>
          <input type="range" class="sat" min="0" max="100" value="${b.satisfaction}" data-slider="satisfaction:${b.id}">
          <div class="slider-note" id="sn-${b.id}">${satText(b.satisfaction)}</div></div>
        <small class="faint">Factores: ${b.riskFactors.map(esc).join(' · ')}</small>
      </div>`).join('')}
  </div>`;
}

function pageRoadmap() {
  const R = S.data.roadmap;
  return head('Roadmap', 'cronograma por grupos · toca el estado para cambiarlo', 'roadmap') + `
  <div class="grid cols-2">
    ${R.groups.map(g => `<div class="card">
      <h3 style="color:${g.color};font-size:var(--fs-1)">${esc(g.name)}</h3>
      <div class="tl">${g.items.map((it, i) => `<div class="tl-item" style="--c:${it.status === 'hecho' ? 'var(--green)' : it.status === 'en curso' ? g.color : 'var(--line2)'}">
        <div class="d">${it.date}</div>
        <div class="tt">${esc(it.title)} <button class="status ${it.status.replace(/ /g, '')}" data-road="${g.id}:${i}">${it.status}</button></div>
      </div>`).join('')}</div>
    </div>`).join('')}
  </div>`;
}

function pageProyectos() {
  const cs = S.data['claude-sessions'];
  return head('Proyectos', 'todo lo que tienes entre manos', 'projects') + `
  <div class="grid cols-2">
    ${S.data.projects.projects.map(p => `<div class="card glass" style="border-top:3px solid ${p.color}">
      <div class="row spread"><div class="kicker" style="color:${p.color}">${esc(p.kind)}</div><span class="status ${p.status.replace(/ /g, '')}">${p.status}</span></div>
      <h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
      ${p.repo ? `<hr class="sep"><small class="faint">repo: ${esc(p.repo)}</small>` : ''}
    </div>`).join('')}
  </div><br>
  <div class="card">
    <div class="kicker">Sesiones de Claude Code (PC de Tenerife)</div>
    ${cs && cs.sessions?.length ? cs.sessions.map(s => `<div class="lrow" style="cursor:default"><div class="t"><b>${esc(s.title || s.file)}</b><small>${esc(s.project)} · ${s.mtime || ''} · ${s.messages || '?'} mensajes</small></div></div>`).join('')
      : `<p>Aún no hay índice. En el PC de Tenerife ejecuta:</p><pre style="background:rgba(0,0,0,.35);padding:12px;border-radius:10px;font-size:.85em">node tools/claude-sessions-export.mjs && git add hq/data && git commit -m "sesiones" && git push</pre><p style="margin-top:6px">Con eso veo tus chats de Claude Code aquí y desde el chat puedo lanzar trabajo sobre esos repos cuando me lo marques.</p>`}
  </div>`;
}

function pageDocs() {
  return head('Docs', 'planes, financiación, marketing, protocolo', 'docs') + `
  <div class="grid" style="grid-template-columns:minmax(200px,260px) 1fr">
    <div>
      ${(S.docsList || []).map(d => `<button class="lrow" style="width:100%" data-doc="${d}"><div class="t"><b>${d.replace('.md', '').replace(/-/g, ' ')}</b></div></button>`).join('')}
    </div>
    <div class="card" id="docview">${S.docContent ? md(S.docContent) : '<p class="muted">Elige un documento.</p>'}</div>
  </div>`;
}

function pageRegistro() {
  return head('Registro', `historial absoluto · ${S.eventsTotal} eventos · nada se borra`, 'events.jsonl') + `
  <p class="muted" style="margin-bottom:14px">Cada cambio guarda la versión anterior: puedes <b>restaurar</b> cualquier momento pasado sin perder nada (la restauración también queda registrada).</p>
  ${S.events.map(ev => `<div class="ev ${ev.actor}">
    <span class="when">${(ev.ts || '').slice(0, 16).replace('T', ' ')}</span>
    <span class="what"><b>${ev.actor === 'claude' ? '🤖' : '👤'} ${esc(ev.type)}</b> · ${esc(ev.section || '')} — ${esc(ev.detail || '')}
      ${ev.payload?.why || ev.why ? `<div class="why">«${esc(ev.payload?.why || ev.why)}»</div>` : ''}</span>
    ${ev.type === 'save' && ev._i != null ? `<button class="btn ghost" data-restore="${ev._i}" style="font-size:.75em">↩ restaurar</button>` : ''}
  </div>`).join('') || '<p class="muted">Sin eventos aún.</p>'}`;
}

function pageAjustes() {
  const st = S.data.settings;
  return head('Ajustes', 'modo desarrollador, sincronización, loop de mejora', 'settings') + `
  <div class="grid cols-2">
    <div class="card">
      <div class="kicker">Interfaz</div>
      <div class="row spread" style="margin-bottom:12px"><span>Modo TV (todo más grande)</span><button class="btn ${st.tvMode ? 'primary' : ''}" data-toggle="tvMode">${st.tvMode ? 'ON' : 'OFF'}</button></div>
      <div class="row spread" style="margin-bottom:12px"><span>Modo desarrollador (ver origen de datos)</span><button class="btn ${st.devMode ? 'primary' : ''}" data-toggle="devMode">${st.devMode ? 'ON' : 'OFF'}</button></div>
      <hr class="sep">
      <div class="kicker">Chromecast</div>
      <p>Para verlo en la tele: Chrome (móvil u ordenador) → menú ⋮ → <b>Enviar a…</b> / <b>Cast</b> → elige tu Chromecast → pestaña completa. Luego abre el modo Presentación. La interfaz está pensada para leerse desde el sofá.</p>
    </div>
    <div class="card">
      <div class="kicker">Sincronizar con Claude</div>
      <p>Guarda tus decisiones/ediciones en git y las sube al repo. Después dime «avanza» en el chat.</p><br>
      <button class="btn primary big" id="gitsync">⇅ Sincronizar con Claude</button>
      <p id="syncmsg" style="margin-top:8px"></p>
      <hr class="sep">
      <div class="kicker">Copia de seguridad</div>
      <button class="btn" id="exportjson">⬇ Exportar todos los datos (JSON)</button>
    </div>
  </div><br>
  <div class="card">
    <div class="kicker">Loop de automejora (lo ejecuto yo, Claude, en cada interacción)</div>
    <p>Nivel actual: <b>${esc(st.improvementLoop.level)}</b></p>
    <ul style="padding-left:1.2em;margin:.5em 0">${Object.entries(st.improvementLoop.levels).map(([k, v]) => `<li><b>${k}:</b> ${esc(v)}</li>`).join('')}</ul>
    <hr class="sep">
    <div class="kicker">Historial de mejoras</div>
    ${st.improvementLoop.log.map(l => `<div class="ev claude"><span class="when">${l.date}</span><span class="what"><b>${esc(l.level)}</b> — ${esc(l.what)}<div class="why">«${esc(l.why)}»</div></span></div>`).join('')}
  </div>`;
}

/* ---------- presentación ---------- */
function buildSlides() {
  const c = S.data.company, P = S.data.products;
  const pend = S.data.decisions.decisions.filter(d => d.status === 'pendiente');
  const slides = [
    { kicker: 'Canicarbon · sistema de dirección', h1: 'Cada techo,\nun pulmón.', body: 'Captura de carbono y aire limpio integrados en el edificio.\n' + new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) },
    { kicker: 'La empresa', h1: c.name, bullets: [`<b>25%</b> Pablo Pacheco · SL en Canarias`, `<b>Puertos 4.0:</b> 1M€ presentado · resolución noviembre`, `<b>Tax lease</b> con Innovalia en estructuración`, `Producto propio en diseño para autofinanciación`] },
    { kicker: 'El mercado', h1: 'La ley vende\npor nosotros.', bullets: ['CTE DB HS3: ventilación <b>obligatoria</b> en obra nueva y reforma', 'Siber participa en >60% de la obra nueva española', 'Si estás <b>en precio</b> y el diseño acompaña, vendes', 'S&P demuestra el camino: país a país, norma a norma'] },
    { kicker: 'Producto 1', h1: P.products[0].shortName + ' — captura CO2', body: P.products[0].concept },
    { kicker: 'Producto 2', h1: P.products[1].shortName + ' — la puerta comercial', body: P.products[1].concept },
    { kicker: 'Números', h1: 'Unit economics', bullets: P.products.map(p => `<b>${p.shortName}:</b> BOM ${eur(p.pricing.bomTotal)} → PVP ${eur(p.pricing.targetPvp)} + ${eur(p.pricing.recambioAnual)}/año recurrente`) },
    { kicker: 'Camino', h1: 'Próximos hitos', bullets: c.milestones.filter(m => m.status !== 'hecho').slice(0, 5).map(m => `<b>${m.date}</b> · ${esc(m.title)}`) }
  ];
  pend.forEach(d => slides.push({ decision: d }));
  slides.push({ kicker: 'Fin', h1: 'Marca y dime\n«avanza».', body: 'Todo lo que has tocado queda registrado.\nYo lo leo, lo ejecuto y te traigo las siguientes tarjetas.' });
  return slides;
}
function renderPresent() {
  const slides = buildSlides();
  if (S.slideIdx >= slides.length) S.slideIdx = slides.length - 1;
  const s = slides[S.slideIdx];
  let inner;
  if (s.decision) {
    const d = s.decision;
    inner = `<div class="slide"><div class="kicker">Decisión · ${esc(d.scope)}</div>
      <h1 style="font-size:clamp(28px,4vw,64px)">${esc(d.title)}</h1>
      <div class="body" style="font-size:clamp(15px,1.7vw,26px);max-width:34em">${esc(d.body.length > 420 ? d.body.slice(0, 420) + '…' : d.body)}</div>
      <div class="popts">${(d.options || []).map((o, i) => `<button class="opt" data-popt="${d.id}:${o.id}"><span class="key">${i + 1}</span><span class="ol">${esc(o.label)}</span><div class="od">${esc(o.detail || '')}</div></button>`).join('')}</div></div>`;
  } else {
    inner = `<div class="slide"><div class="kicker">${s.kicker}</div><h1>${esc(s.h1).replace(/\n/g, '<br>')}</h1>
      ${s.body ? `<div class="body">${esc(s.body)}</div>` : ''}
      ${s.bullets ? `<ul class="pbullets">${s.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}</div>`;
  }
  app.innerHTML = `<div class="present">${inner}
    <div class="pfoot">
      <button class="btn ghost" id="pexit">✕ salir</button>
      <div class="pdots">${slides.map((_, i) => `<i class="${i === S.slideIdx ? 'on' : ''}"></i>`).join('')}</div>
      <div class="row"><button class="btn ghost" id="pcast">📺 Chromecast</button><span>${S.slideIdx + 1} / ${slides.length}</span></div>
    </div>
    <div class="pnav-zone left"></div><div class="pnav-zone right"></div>
  </div>`;
  $('#pexit').onclick = () => { location.hash = '#/panel'; };
  $('#pcast').onclick = () => modal(`<h3>Ver en la tele</h3><p class="muted">1 · Abre esta página en Chrome.<br>2 · Menú ⋮ → <b>Enviar a…</b> (Cast).<br>3 · Elige tu Chromecast → pestaña completa.<br><br>El modo presentación está diseñado para TV: letras gigantes y botones que también puedes tocar desde el móvil mientras se ve en la tele.</p>`);
  document.querySelector('.pnav-zone.left').onclick = () => { S.slideIdx = Math.max(0, S.slideIdx - 1); renderPresent(); };
  document.querySelector('.pnav-zone.right').onclick = () => { S.slideIdx = Math.min(slides.length - 1, S.slideIdx + 1); renderPresent(); };
  document.querySelectorAll('[data-popt]').forEach(b => b.onclick = async e => {
    e.stopPropagation();
    const [did, oid] = b.dataset.popt.split(':');
    await decide(did, oid, null);
    renderPresent();
    toast('Decisión registrada ✓');
  });
}

/* ---------- decisión (compartido deck + presentación) ---------- */
async function decide(did, optId, text) {
  const d = S.data.decisions.decisions.find(x => x.id === did);
  if (!d) return;
  const opt = (d.options || []).find(o => o.id === optId);
  d.answer = { option: optId || null, label: opt?.label || null, text: text || null };
  d.status = 'decidida'; d.decidedAt = today();
  await save('decisions', `decisión «${d.title}» → ${opt?.label || text || ''}`);
  logEvent('decision', d.scope, `«${d.title}» → ${opt?.label || ''}${text ? ' + texto: ' + text : ''}`, { id: d.id, option: optId, text });
}

/* ---------- render + eventos globales ---------- */
async function render() {
  const r = S.route;
  if (r === 'presentacion') { renderPresent(); return; }
  if (r === 'registro') {
    try { const res = await api('/api/events?limit=300'); S.events = res.events; S.eventsTotal = res.total; } catch { S.events = []; }
  }
  if (r === 'docs' && !S.docsList) {
    try { S.docsList = (await api('/api/docs')).docs; } catch { S.docsList = []; }
  }
  const pages = { panel: pagePanel, decisiones: pageDecisiones, ideas: pageIdeas, empresa: pageEmpresa, producto: pageProducto, contactos: pageContactos, finanzas: pageFinanzas, perfil: pagePerfil, roadmap: pageRoadmap, proyectos: pageProyectos, docs: pageDocs, registro: pageRegistro, ajustes: pageAjustes };
  app.innerHTML = shell((pages[r] || pagePanel)());
  bind();
}
function bind() {
  document.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => {
    const r = b.dataset.nav;
    if (r === '__more') return moreSheet();
    location.hash = '#/' + r;
  });
  // decisiones
  document.querySelectorAll('.dcard .opt').forEach(b => b.onclick = async () => {
    const pend = S.data.decisions.decisions.filter(d => d.status === 'pendiente');
    const d = pend[S.deckIdx];
    const text = $('#dtext')?.value.trim() || null;
    await decide(d.id, b.dataset.opt, text);
    render(); askWhy(d.scope, d.title);
  });
  const dsend = $('#dtextsend');
  if (dsend) dsend.onclick = async () => {
    const pend = S.data.decisions.decisions.filter(d => d.status === 'pendiente');
    const d = pend[S.deckIdx];
    const text = $('#dtext').value.trim();
    if (!text) return toast('Escribe algo primero');
    await decide(d.id, null, text);
    render(); toast('Respuesta guardada — la leeré al sincronizar');
  };
  const dskip = $('#dskip'); if (dskip) dskip.onclick = () => { S.deckIdx++; render(); };
  const dprev = $('#dprev'); if (dprev) dprev.onclick = () => { S.deckIdx = Math.max(0, S.deckIdx - 1); render(); };
  // ideas
  document.querySelectorAll('[data-folder]').forEach(b => b.onclick = () => { S.ideasFolder = b.dataset.folder || null; render(); });
  const addI = $('#addidea'); if (addI) addI.onclick = () => ideaModal(null);
  document.querySelectorAll('[data-check]').forEach(b => b.onclick = async e => {
    e.stopPropagation();
    const i = S.data.ideas.ideas.find(x => x.id === b.dataset.check);
    i.done = !i.done; i.status = i.done ? 'hecho' : 'en curso';
    await save('ideas', `idea ${i.done ? 'completada' : 'reabierta'}: ${i.title}`);
    logEvent('idea', 'ideas', (i.done ? 'hecha ✓: ' : 'reabierta: ') + i.title);
    render();
  });
  document.querySelectorAll('[data-idea]').forEach(row => row.onclick = () => ideaModal(S.data.ideas.ideas.find(x => x.id === row.dataset.idea)));
  // contactos
  document.querySelectorAll('[data-group]').forEach(b => b.onclick = () => { S.contactsGroup = b.dataset.group || null; render(); });
  const addC = $('#addcontact'); if (addC) addC.onclick = () => contactModal(null);
  document.querySelectorAll('[data-contact]').forEach(row => row.onclick = () => contactModal(S.data.contacts.contacts.find(x => x.id === row.dataset.contact)));
  // finanzas
  document.querySelectorAll('[data-scenario]').forEach(b => b.onclick = () => { S.scenario = b.dataset.scenario; render(); });
  // perfil
  document.querySelectorAll('[data-slider]').forEach(sl => {
    const [kind, id] = sl.dataset.slider.split(':');
    const b = S.data.personal.businessStakes.find(x => x.id === id);
    sl.oninput = () => {
      const v = +sl.value;
      $('#' + (kind === 'risk' ? 'rv' : 'sv') + '-' + id).textContent = v;
      const note = $('#' + (kind === 'risk' ? 'rn' : 'sn') + '-' + id);
      if (kind === 'risk') note.textContent = v < 25 ? 'Riesgo bajo: exposición controlada.' : v < 55 ? 'Riesgo medio: vigilar compromisos y no firmar avales.' : v < 80 ? 'Riesgo alto: hay dinero/tiempo serio en juego; decisiones por escrito.' : 'Riesgo crítico: no avanzar sin asesoría independiente.';
      else note.textContent = v < 30 ? 'Te está drenando. ¿Merece seguir?' : v < 60 ? 'Neutro: revisa si el esfuerzo compensa.' : 'Te da energía: protege este proyecto en tu agenda.';
    };
    sl.onchange = async () => {
      b[kind === 'risk' ? 'risk' : 'satisfaction'] = +sl.value;
      await save('personal', `${kind} de ${b.name} → ${sl.value}`);
      logEvent('slider', 'personal', `${b.name}: ${kind} = ${sl.value}`);
      askWhy('personal', `${b.name} ${kind}=${sl.value}`);
    };
  });
  document.querySelectorAll('[data-editmoney]').forEach(b => b.onclick = () => {
    const [list, id] = b.dataset.editmoney.split(':');
    const item = S.data.personal.monthly[list].find(x => x.id === id);
    modal(`<h3>${esc(item.name)}</h3><div class="field"><label>€ / mes</label><input id="m-amt" type="number" value="${item.amount}"></div>
      <button class="btn primary" id="m-save">Guardar</button>`, ov => {
      ov.querySelector('#m-save').onclick = async () => {
        item.amount = +ov.querySelector('#m-amt').value || 0;
        await save('personal', `${item.name} → ${item.amount} €/mes`);
        logEvent('edit', 'personal', `${item.name} = ${item.amount} €/mes`);
        ov.remove(); render();
      };
    });
  });
  const mks = $('#mksave'); if (mks) mks.onclick = async () => {
    S.data.personal.projection.marker.amount = +$('#mkamount').value || 0;
    await save('personal', 'marcador de proyección actualizado');
    logEvent('edit', 'personal', `marcador: +${$('#mkamount').value} €/mes desde ${S.data.personal.projection.marker.month}`);
    render(); toast('Marcador guardado');
  };
  const pchart = $('#projchart'); if (pchart) pchart.onclick = e => {
    const svg = pchart.querySelector('svg'); const rect = svg.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    const months = []; const d0 = new Date();
    for (let i = 0; i < 14; i++) { const d = new Date(d0.getFullYear(), d0.getMonth() + i, 1); months.push(d.toISOString().slice(0, 7)); }
    const idx = Math.min(13, Math.max(0, Math.round(frac * 13)));
    S.data.personal.projection.marker.month = months[idx];
    render(); toast('Marcador movido a ' + months[idx] + ' — guarda con el botón');
  };
  // roadmap
  document.querySelectorAll('[data-road]').forEach(b => b.onclick = async () => {
    const [gid, i] = b.dataset.road.split(':');
    const item = S.data.roadmap.groups.find(g => g.id === gid).items[+i];
    item.status = item.status === 'pendiente' ? 'en curso' : item.status === 'en curso' ? 'hecho' : 'pendiente';
    await save('roadmap', `hito «${item.title}» → ${item.status}`);
    logEvent('edit', 'roadmap', `${item.title} → ${item.status}`);
    render();
  });
  // docs
  document.querySelectorAll('[data-doc]').forEach(b => b.onclick = async () => {
    S.docContent = await api('/api/docs/' + b.dataset.doc); S.docOpen = b.dataset.doc; render();
  });
  // registro
  document.querySelectorAll('[data-restore]').forEach(b => b.onclick = async () => {
    if (!confirm('¿Restaurar la versión anterior a este cambio? (no se borra nada, queda registrado)')) return;
    await api('/api/restore', { method: 'POST', body: JSON.stringify({ index: +b.dataset.restore }) });
    S.data = await api('/api/data'); render(); toast('Restaurado ✓');
  });
  // panel
  const sn = $('#savenote'); if (sn) sn.onclick = async () => {
    S.data.settings.notesToClaude = $('#noteclaude').value;
    await save('settings', 'nota para Claude actualizada');
    logEvent('note', 'settings', 'nota para Claude: ' + $('#noteclaude').value.slice(0, 120));
    toast('Guardada — la leeré al sincronizar');
  };
  // ajustes
  document.querySelectorAll('[data-toggle]').forEach(b => b.onclick = async () => {
    const k = b.dataset.toggle;
    S.data.settings[k] = !S.data.settings[k];
    if (k === 'tvMode') document.documentElement.classList.toggle('tv', S.data.settings.tvMode);
    await save('settings', k + ' → ' + S.data.settings[k]);
    render();
  });
  const gs = $('#gitsync'); if (gs) gs.onclick = async () => {
    $('#syncmsg').textContent = 'Sincronizando…';
    try {
      const r = await api('/api/git-sync', { method: 'POST', body: '{}' });
      $('#syncmsg').textContent = r.pushed ? '✓ Subido. Ahora dime «avanza» en el chat de Claude.' : '✓ ' + (r.note || 'Commit local hecho.');
    } catch (e) { $('#syncmsg').textContent = '✗ ' + e.message; }
  };
  const ex = $('#exportjson'); if (ex) ex.onclick = () => {
    const blob = new Blob([JSON.stringify(S.data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'canicarbon-hq-' + today() + '.json'; a.click();
  };
}
function moreSheet() {
  modal(`<h3>Ir a…</h3><div class="grid cols-2">${NAV.map(([r, ico, name]) => `<button class="btn big" data-nav2="${r}">${ico} ${name}</button>`).join('')}</div>`,
    ov => ov.querySelectorAll('[data-nav2]').forEach(b => b.onclick = () => { ov.remove(); location.hash = '#/' + b.dataset.nav2; }));
}

/* ---------- teclado ---------- */
document.addEventListener('keydown', e => {
  if (e.target.matches('input,textarea,select')) return;
  if (S.route === 'presentacion') {
    if (e.key === 'ArrowRight' || e.key === ' ') { S.slideIdx++; renderPresent(); }
    if (e.key === 'ArrowLeft') { S.slideIdx = Math.max(0, S.slideIdx - 1); renderPresent(); }
    if (e.key === 'Escape') location.hash = '#/panel';
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) { const b = document.querySelectorAll('[data-popt]')[n - 1]; if (b) b.click(); }
    return;
  }
  if (S.route === 'decisiones') {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) { const b = document.querySelectorAll('.dcard .opt')[n - 1]; if (b) b.click(); }
    if (e.key === 'ArrowRight') { S.deckIdx++; render(); }
    if (e.key === 'ArrowLeft') { S.deckIdx = Math.max(0, S.deckIdx - 1); render(); }
  }
});
/* gestos táctiles en presentación */
let tx = null;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  if (tx == null || S.route !== 'presentacion') return;
  const dx = e.changedTouches[0].clientX - tx;
  if (dx < -60) { S.slideIdx++; renderPresent(); }
  if (dx > 60) { S.slideIdx = Math.max(0, S.slideIdx - 1); renderPresent(); }
  tx = null;
}, { passive: true });

/* ---------- arranque ---------- */
window.addEventListener('hashchange', () => {
  S.route = (location.hash.replace('#/', '') || 'panel').split('?')[0];
  render();
});
(async () => {
  await loadAll();
  document.documentElement.classList.toggle('tv', !!S.data.settings.tvMode);
  S.route = location.hash.replace('#/', '') || 'panel';
  render();
  if (S.readonly) toast('Sin servidor: modo lectura con última copia local', 4000);
})();
