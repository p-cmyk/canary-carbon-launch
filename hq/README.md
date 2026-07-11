# Canicarbon HQ

Sistema de dirección local de Pablo. Sin dependencias: solo Node.

## Arrancar

```bash
node hq/server.js
# → http://localhost:4747
```

## Qué hay

| Ruta | Qué es |
|---|---|
| Panel | resumen, cuenta atrás Puertos 4.0, nota fija para Claude |
| Decisiones | tarjetas con botones grandes (teclas 1-9); lo que marcas lo lee Claude |
| Ideas | carpetas, fechas, estados, notas, marcar hecho |
| Empresa | cap table, subvenciones, hitos |
| Producto | CC-Air + HR-01: specs, BOM, precios, competencia, normativa |
| Contactos | CRM con grupos de interés por colores |
| Finanzas | escenarios de caja de la empresa con gráficas |
| Perfil | tus finanzas personales, impuestos, riesgo/satisfacción por negocio |
| Roadmap | cronograma por grupos, estados clicables |
| Docs | planes de negocio, financiación, kit de marketing (emails listos) |
| Presentación | modo TV/Chromecast: diapositivas gigantes con decisiones integradas |
| Registro | historial absoluto append-only, con restauración a cualquier momento |
| Ajustes | modo TV, modo dev, sincronizar con Claude, exportar |

## El loop con Claude

1. Marca y edita en la interfaz (todo queda en `hq/data/` + `events.jsonl`).
2. Ajustes → **Sincronizar con Claude** (commit+push automático).
3. En el chat de Claude escribe «avanza». Claude lee tus marcas como si se lo hubieras dicho por chat, ejecuta, mejora la interfaz y deja tarjetas nuevas.

Protocolo completo: `hq/docs/protocolo-agente.md` y `CLAUDE.md` (raíz).

## Landing del producto

`http://localhost:4747/landing.html` — prototipo v1 (nubes + metal + cristal).
