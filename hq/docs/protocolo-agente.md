# Protocolo de trabajo Pablo ↔ Claude (el loop)

## La idea

La interfaz HQ es el tablero; el chat de Claude es el motor. Todo lo que Pablo marca en la interfaz queda registrado en `hq/data/events.jsonl` y en los JSON de `hq/data/`. Claude lo lee al inicio de cada sesión como si Pablo lo hubiera dicho en el chat.

## El ciclo completo

1. **Pablo usa la interfaz** (localhost): decide tarjetas, edita fichas, escribe motivos en la ventanita "¿por qué?", añade ideas, mueve sliders.
2. **Sincronizar**: botón "Sincronizar con Claude" en Ajustes (hace commit+push de `hq/data/`) — o `git add hq/data && git commit -m "hq: datos" && git push`.
3. **Pablo escribe en el chat** — vale con una palabra: "avanza".
4. **Claude (yo) al recibir cualquier mensaje:**
   - `git pull` y leo los eventos nuevos de `events.jsonl` desde mi última marca.
   - Interpreto cada decisión/edición/motivo como mensajes de Pablo.
   - Ejecuto lo decidido (si una tarjeta marcada implica una acción — p.ej. "genera renders con RaFi" — la lanzo).
   - **Loop de automejora nivel básico**: hago al menos 1 micro-mejora real de la interfaz por interacción (analizando captura propia con Chromium headless cuando toque revisar diseño).
   - Regenero las tarjetas: las decididas pasan a histórico, creo las nuevas que el trabajo pida.
   - Hago commit+push y respondo en el chat con: qué he hecho, qué he entendido de sus marcas, y **opciones tipo botón al final** (numeradas, obvias, respondibles con "1", "2"...).
5. **Nunca borro nada**: el registro es append-only. Restaurar = añadir un evento de restauración.

## Niveles del loop de automejora

- **Básico (siempre activo):** micro-mejoras de interfaz/textos/botones en cada interacción. Coste mínimo.
- **Medio (semanal o al pedirlo):** análisis de una sección completa (con captura de pantalla + comparación con mejores prácticas), propuestas como tarjetas.
- **Radical (solo si Pablo lo pide):** rediseño de sección o arquitectura.

Sin equipos de agentes: todo en un solo contexto para no quemar tokens (norma fijada por Pablo el 2026-07-11).

## Conexiones externas

- **Google Drive:** no disponible en esta sesión. Alternativas: conectar el conector de Google Drive en claude.ai, o dejar archivos en `hq/inbox/` (commit+push) y los leo.
- **RaFi:** pendiente de decidir (tarjeta d3): repo (preferido, se añade con "añade owner/repo" en el chat) o acceso web.
- **Chats de Claude Code del PC de Tenerife:** Claude Code guarda las sesiones en `~/.claude/projects/<proyecto>/*.jsonl`. Ejecutar `node tools/claude-sessions-export.mjs` en ese PC genera `hq/data/claude-sessions.json` (índice con resúmenes); con push, esta sesión los ve y la interfaz los muestra. Fase 2 (cuando Pablo quiera): lanzar agentes en otros repos desde tarjetas de decisión — yo los lanzo desde aquí al leer la marca.

## Formato de eventos (`events.jsonl`)

```json
{"ts":"ISO8601","actor":"pablo|claude","type":"decision|edit|idea|note|slider|restore|system","section":"...","detail":"...","why":"motivo opcional de la ventanita","payload":{}}
```
