import { Check, ChevronRight, Loader2, TrendingUp } from "lucide-react";
import type { AgentLang, Ficha } from "./script";
import { formatEUR } from "./script";

type AgentCardProps = {
  card: Ficha;
  lang: AgentLang;
  onAction: (optionId: string) => void;
};

const Shell = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-[#1a1a19] border border-white/10 rounded-[20px] p-4">
    <h3 className="text-[15px] font-semibold text-[#f5f4ef]">{title}</h3>
    {children}
  </div>
);

// Barras horizontales finas (marca de 8px, extremo redondeado, etiqueta directa).
const BarRow = ({
  label,
  valueLabel,
  ratio,
  color,
}: {
  label: string;
  valueLabel: string;
  ratio: number;
  color: string;
}) => (
  <div>
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[13px] text-[#c3c2b7] truncate">{label}</span>
      <span className="text-[13px] text-[#f5f4ef] tabular-nums shrink-0">{valueLabel}</span>
    </div>
    <div className="mt-1 h-2 rounded-full bg-[#2c2c2a]">
      <div
        className="h-2 rounded-full"
        style={{ width: `${Math.max(6, Math.round(ratio * 100))}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export const AgentCard = ({ card, lang, onAction }: AgentCardProps) => {
  if (card.kind === "options") {
    return (
      <Shell title={card.title}>
        {card.subtitle ? (
          <p className="text-[13px] text-[#898781] mt-0.5">{card.subtitle}</p>
        ) : null}
        <div className="mt-3 flex flex-col gap-2">
          {card.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onAction(opt.id)}
              className="w-full min-h-[56px] flex items-center gap-3 text-left bg-[#242422] border border-white/[0.06] rounded-[14px] px-4 py-3 active:scale-[0.98] transition-transform"
            >
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-[15px] font-medium text-[#f5f4ef] leading-snug">
                    {opt.title}
                  </span>
                  {opt.badge ? (
                    <span className="text-[11px] font-semibold text-[#30D158] bg-[#30D158]/10 rounded-full px-2 py-0.5 shrink-0">
                      {opt.badge}
                    </span>
                  ) : null}
                </span>
                <span className="block text-[13px] text-[#898781] mt-0.5 tabular-nums">
                  {opt.meta}
                </span>
              </span>
              <ChevronRight className="w-5 h-5 text-[#898781] shrink-0" />
            </button>
          ))}
        </div>
      </Shell>
    );
  }

  if (card.kind === "budget") {
    const max = Math.max(...card.items.map((i) => i.value));
    const total = card.items.reduce((acc, i) => acc + i.value, 0);
    return (
      <Shell title={card.title}>
        <div className="mt-3 flex flex-col gap-3">
          {card.items.map((item) => (
            <BarRow
              key={item.label}
              label={item.label}
              valueLabel={formatEUR(item.value, lang)}
              ratio={item.value / max}
              color="#3987e5"
            />
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 flex items-end justify-between gap-3">
          <div>
            <p className="text-[12px] text-[#898781]">{card.totalLabel}</p>
            <p className="text-[24px] font-semibold text-[#f5f4ef] tabular-nums leading-tight">
              {formatEUR(total, lang)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-[#898781]">{card.deltaLabel}</p>
            <p className="text-[17px] font-semibold text-[#0ca30c] tabular-nums leading-tight flex items-center justify-end gap-1">
              <TrendingUp className="w-4 h-4" />
              +{formatEUR(card.deltaValue, lang)}
            </p>
          </div>
        </div>
        {card.footnote ? (
          <p className="text-[12px] text-[#898781] mt-2">{card.footnote}</p>
        ) : null}
      </Shell>
    );
  }

  if (card.kind === "hours") {
    const max = Math.max(...card.items.map((i) => i.hours));
    const total = card.items.reduce((acc, i) => acc + i.hours, 0);
    return (
      <Shell title={card.title}>
        <div className="mt-3 flex flex-col gap-3">
          {card.items.map((item) => (
            <BarRow
              key={item.label}
              label={item.label}
              valueLabel={`${item.hours} h`}
              ratio={item.hours / max}
              color="#199e70"
            />
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
          <p className="text-[12px] text-[#898781]">{card.totalLabel}</p>
          <p className="text-[20px] font-semibold text-[#f5f4ef] tabular-nums">{total} h</p>
        </div>
        {card.footnote ? (
          <p className="text-[12px] text-[#898781] mt-1">{card.footnote}</p>
        ) : null}
      </Shell>
    );
  }

  if (card.kind === "progress") {
    const pct = Math.round((card.done / card.steps.length) * 100);
    return (
      <Shell title={card.title}>
        <div className="mt-3 h-2 rounded-full bg-[#2c2c2a]">
          <div
            className="h-2 rounded-full bg-[#30D158] transition-all duration-500"
            style={{ width: `${Math.max(4, pct)}%` }}
          />
        </div>
        <ul className="mt-3 flex flex-col gap-2.5">
          {card.steps.map((step, i) => {
            const done = i < card.done;
            const active = i === card.done && card.done < card.steps.length;
            return (
              <li key={step} className="flex items-center gap-2.5">
                {done ? (
                  <span className="w-5 h-5 rounded-full bg-[#30D158] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#0d0d0d]" strokeWidth={3} />
                  </span>
                ) : active ? (
                  <Loader2 className="w-5 h-5 text-[#3987e5] animate-spin shrink-0" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-[#383835] shrink-0" />
                )}
                <span
                  className={`text-[14px] ${
                    done ? "text-[#c3c2b7]" : active ? "text-[#f5f4ef]" : "text-[#898781]"
                  }`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ul>
      </Shell>
    );
  }

  // stats
  return (
    <Shell title={card.title}>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {card.stats.map((s) => (
          <div key={s.label} className="bg-[#242422] rounded-[14px] px-3 py-3">
            <p
              className={`text-[19px] font-semibold tabular-nums leading-tight ${
                s.tone === "good"
                  ? "text-[#0ca30c]"
                  : s.tone === "bad"
                    ? "text-[#d03b3b]"
                    : "text-[#f5f4ef]"
              }`}
            >
              {s.value}
            </p>
            <p className="text-[11px] text-[#c3c2b7] mt-1 leading-snug">{s.label}</p>
            {s.hint ? (
              <p className="text-[11px] text-[#898781] mt-0.5 leading-snug">{s.hint}</p>
            ) : null}
          </div>
        ))}
      </div>
    </Shell>
  );
};
