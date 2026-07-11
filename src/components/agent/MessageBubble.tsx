import type { ChatMessage } from "./script";
import { AgentCard } from "./AgentCards";
import type { AgentLang } from "./script";

type MessageBubbleProps = {
  message: ChatMessage;
  lang: AgentLang;
  onCardAction: (optionId: string) => void;
};

export const MessageBubble = ({ message, lang, onCardAction }: MessageBubbleProps) => {
  if (message.role === "system") {
    return (
      <div className="flex justify-center px-6 animate-[agent-fade-up_0.25s_ease-out_both]">
        <span className="text-[12px] text-[#898781] bg-[#1a1a19] border border-white/10 rounded-full px-3.5 py-1.5 text-center">
          {message.text}
        </span>
      </div>
    );
  }

  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end px-4 animate-[agent-fade-up_0.25s_ease-out_both]">
        <div className="max-w-[85%] bg-[#2b2a27] text-[#f5f4ef] text-[17px] leading-[1.4] rounded-[20px] rounded-br-[6px] px-4 py-2.5 whitespace-pre-wrap break-words">
          {message.text}
        </div>
        <span className="text-[11px] text-[#898781] mt-1 mr-1">{message.time}</span>
      </div>
    );
  }

  // Mensajes de la guía: texto plano sobre el fondo, como en la app de Claude.
  return (
    <div className="flex flex-col items-start px-4 animate-[agent-fade-up_0.25s_ease-out_both]">
      {message.text ? (
        <div className="max-w-[92%] text-[#f0efea] text-[17px] leading-[1.45] whitespace-pre-wrap break-words">
          {message.text}
        </div>
      ) : null}
      {message.card ? (
        <div className="w-full max-w-[94%] mt-2">
          <AgentCard card={message.card} lang={lang} onAction={onCardAction} />
        </div>
      ) : null}
      <span className="text-[11px] text-[#898781] mt-1 ml-0.5">{message.time}</span>
    </div>
  );
};

export const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-5 py-1 animate-[agent-fade-up_0.2s_ease-out_both]">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-[#898781]"
        style={{ animation: `agent-blink 1.2s ease-in-out ${i * 0.18}s infinite` }}
      />
    ))}
  </div>
);
