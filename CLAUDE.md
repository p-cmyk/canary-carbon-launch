# canary-carbon-launch

Dos cosas conviven en este repo:

1. **Landing pública de Canicarbon** (raíz): Vite + React + shadcn (generada con Lovable). `npm i && npm run dev`. No romperla.
2. **Canicarbon HQ** (`hq/`): sistema de dirección de Pablo. Node puro sin dependencias: `node hq/server.js` → http://localhost:4747.

## Protocolo del agente (OBLIGATORIO al inicio de cada sesión)

Pablo trabaja marcando botones en la interfaz HQ; sus marcas se guardan en `hq/data/`. Tú (Claude) eres la otra mitad del sistema. En CADA mensaje de Pablo (aunque solo diga «avanza»):

1. `git pull` y lee `hq/data/events.jsonl` — los eventos con `actor:"pablo"` posteriores a tu último evento `actor:"claude"` son mensajes suyos: decisiones tomadas, ediciones, motivos («why»), notas.
2. Lee `hq/data/settings.json` → `notesToClaude` (su nota fija) y `hq/data/decisions.json` → respuestas.
3. **Ejecuta lo decidido.** Si una decisión implica una acción externa (p.ej. generar renders con RaFi, mandar un email, lanzar trabajo en otro repo), hazla o explica qué falta.
4. **Loop de automejora nivel básico:** haz al menos una micro-mejora real en la interfaz por interacción. Nivel medio/radical solo según `settings.json` o si Pablo lo pide. SIN equipos de agentes ni Workflow: un solo contexto (norma de Pablo, 2026-07-11).
5. Regenera tarjetas: decididas → histórico; crea las nuevas que el trabajo pida (edita `hq/data/decisions.json`).
6. Registra tus acciones como eventos `actor:"claude"` en `events.jsonl` (append-only, NUNCA borres ni reescribas líneas).
7. Commit + push de todo.
8. Responde en el chat: qué entendiste de sus marcas, qué hiciste, y termina SIEMPRE con opciones numeradas tipo botón (obvias, respondibles con «1», «2»…).

## Reglas duras

- `hq/data/events.jsonl` es append-only. Restaurar = evento nuevo `type:"restore"`.
- No borrar datos de Pablo; los placeholders «— completar —» se sustituyen solo con datos que él dé.
- Los documentos vivos están en `hq/docs/` (financiación, producto, marketing, plan, protocolo).
- Archivos que Pablo suba para que los leas: `hq/inbox/`.
- Sesiones de Claude Code de sus otros PCs: índice en `hq/data/claude-sessions.json` (generado por `tools/claude-sessions-export.mjs`).
- Rama de trabajo: `claude/canicarbon-management-system-lnit4n`.
