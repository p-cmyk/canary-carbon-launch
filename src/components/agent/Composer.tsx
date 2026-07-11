import { useRef } from "react";
import { ArrowUp, Check, Mic, Plus, Video, VideoOff, X } from "lucide-react";
import { Waveform } from "./Waveform";

type ComposerProps = {
  draft: string;
  interim: string;
  listening: boolean;
  camOn: boolean;
  placeholder: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onMicStart: () => void;
  onVoiceAccept: () => void;
  onVoiceCancel: () => void;
  onCamToggle: () => void;
  onAttach: () => void;
  getMicLevel: () => number;
};

// Botón circular táctil (mínimo 40px, como los controles del iPhone).
const RoundButton = ({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform ${className ?? ""}`}
  >
    {children}
  </button>
);

export const Composer = ({
  draft,
  interim,
  listening,
  camOn,
  placeholder,
  onDraftChange,
  onSend,
  onMicStart,
  onVoiceAccept,
  onVoiceCancel,
  onCamToggle,
  onAttach,
  getMicLevel,
}: ComposerProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  };

  const handleSend = () => {
    onSend();
    const el = textareaRef.current;
    if (el) el.style.height = "auto";
  };

  return (
    <div className="mx-3 rounded-[24px] bg-[#1f1e1c] border border-white/10 px-3 pt-2.5 pb-2">
      <textarea
        ref={textareaRef}
        rows={1}
        value={listening && interim ? interim : draft}
        readOnly={listening && !!interim}
        onChange={(e) => {
          onDraftChange(e.target.value);
          autoGrow();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder={placeholder}
        className={`w-full bg-transparent resize-none outline-none text-[17px] leading-snug placeholder:text-[#8a887f] px-1 ${
          listening && interim ? "text-[#c3c2b7] italic" : "text-[#f5f4ef]"
        }`}
      />
      {listening ? (
        <div className="flex items-center gap-2 mt-1">
          <RoundButton label="Cancelar voz" onClick={onVoiceCancel} className="bg-[#2b2a27]">
            <X className="w-5 h-5 text-[#f5f4ef]" />
          </RoundButton>
          <Waveform
            getLevel={getMicLevel}
            active
            color="#f5f4ef"
            className="flex-1 h-9 min-w-0"
          />
          <button
            type="button"
            aria-label="Aceptar voz"
            onClick={onVoiceAccept}
            className="w-11 h-11 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-1">
          <RoundButton label="Adjuntar" onClick={onAttach} className="bg-[#2b2a27]">
            <Plus className="w-5 h-5 text-[#f5f4ef]" />
          </RoundButton>
          <RoundButton
            label={camOn ? "Apagar cámara" : "Encender cámara"}
            onClick={onCamToggle}
            className={camOn ? "bg-[#FF453A]/15" : "bg-[#2b2a27]"}
          >
            {camOn ? (
              <VideoOff className="w-5 h-5 text-[#FF453A]" />
            ) : (
              <Video className="w-5 h-5 text-[#f5f4ef]" />
            )}
          </RoundButton>
          <div className="flex-1" />
          <RoundButton label="Hablar" onClick={onMicStart} className="bg-[#2b2a27]">
            <Mic className="w-5 h-5 text-[#f5f4ef]" />
          </RoundButton>
          {draft.trim() ? (
            <button
              type="button"
              aria-label="Enviar"
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 active:scale-95 transition-transform animate-[agent-fade-up_0.15s_ease-out_both]"
            >
              <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};
