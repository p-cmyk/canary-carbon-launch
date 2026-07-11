import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, Leaf, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  type ChatMessage,
  type Ficha,
  type QuickReply,
  getCopy,
  matchIntent,
  matchOption,
} from "./script";
import { useVoice } from "./useVoice";
import { useCamera } from "./useCamera";
import { MessageBubble, TypingDots } from "./MessageBubble";
import { Composer } from "./Composer";
import { Waveform } from "./Waveform";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Step = "intro" | "options" | "launch" | "adjust" | "done";

export const AgentChat = () => {
  const { language } = useLanguage();
  const copy = useMemo(() => getCopy(language), [language]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [quick, setQuick] = useState<QuickReply[]>([]);
  const [draft, setDraft] = useState("");
  const [speakerOn, setSpeakerOn] = useState(true);

  const stepRef = useRef<Step>("intro");
  const idRef = useRef(0);
  const aliveRef = useRef(true);
  const startedRef = useRef(false);
  const proVoiceNotedRef = useRef(false);
  const fallbackIdxRef = useRef(0);
  const speakerOnRef = useRef(true);
  const copyRef = useRef(copy);
  const endRef = useRef<HTMLDivElement | null>(null);
  copyRef.current = copy;

  const handleUserRef = useRef<(text: string, id?: string) => void>(() => {});

  const voice = useVoice({
    lang: language,
    onFinal: (text) => handleUserRef.current(text),
  });
  const cam = useCamera();

  const now = () =>
    new Date().toLocaleTimeString(language === "es" ? "es-ES" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const push = useCallback(
    (partial: Omit<ChatMessage, "id" | "time">): string => {
      const id = `m${++idRef.current}`;
      setMessages((ms) => [...ms, { ...partial, id, time: now() }]);
      return id;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language],
  );

  const pushSystem = useCallback((text: string) => push({ role: "system", text }), [push]);

  const delayFor = (item: string | Ficha) =>
    typeof item === "string" ? Math.min(1500, 500 + item.length * 8) : 800;

  const agentSay = useCallback(
    async (items: (string | Ficha)[], nextQuick?: QuickReply[]): Promise<string> => {
      let lastId = "";
      for (const item of items) {
        if (!aliveRef.current) return lastId;
        setTyping(true);
        await wait(delayFor(item));
        if (!aliveRef.current) return lastId;
        setTyping(false);
        if (typeof item === "string") {
          lastId = push({ role: "agent", text: item });
          if (speakerOnRef.current) voice.speak(item);
        } else {
          lastId = push({ role: "agent", card: item });
        }
        await wait(250);
      }
      if (aliveRef.current && nextQuick) setQuick(nextQuick);
      return lastId;
    },
    [push, voice],
  );

  const runLaunch = useCallback(async () => {
    const c = copyRef.current;
    const cardId = await agentSay([c.progressCard]);
    const total = c.progressCard.kind === "progress" ? c.progressCard.steps.length : 0;
    for (let i = 1; i <= total; i++) {
      await wait(1000);
      if (!aliveRef.current) return;
      setMessages((ms) =>
        ms.map((m) =>
          m.id === cardId && m.card?.kind === "progress"
            ? { ...m, card: { ...m.card, done: i } }
            : m,
        ),
      );
    }
    await agentSay([c.launched], c.quickDone);
  }, [agentSay]);

  const toggleCamera = useCallback(async () => {
    const c = copyRef.current;
    if (cam.camOn) {
      cam.stopCam();
      pushSystem(c.ui.camOff);
      return;
    }
    const ok = await cam.startCam();
    if (ok) {
      pushSystem(c.ui.camPro);
      agentSay([c.cameraOn]);
    } else {
      pushSystem(c.ui.camDenied);
    }
  }, [agentSay, cam, pushSystem]);

  const startConversation = useCallback(async () => {
    const c = copyRef.current;
    const ok = await voice.startMic();
    if (!ok) {
      pushSystem(c.ui.micDenied);
      return;
    }
    if (!proVoiceNotedRef.current) {
      proVoiceNotedRef.current = true;
      pushSystem(c.ui.voicePro);
      if (!voice.dictationSupported) pushSystem(c.ui.dictationNote);
    }
  }, [pushSystem, voice]);

  const routeOption = useCallback(
    (optId: string) => {
      const c = copyRef.current;
      stepRef.current = "launch";
      if (optId === "report") {
        agentSay([c.hoursIntro, c.hoursCard, c.launchAsk], c.quickLaunch);
      } else {
        const budget = c.budgets[optId as keyof typeof c.budgets] ?? c.budgets.certs;
        agentSay([c.budgetIntro, budget, c.launchAsk], c.quickLaunch);
      }
    },
    [agentSay],
  );

  const handleUser = useCallback(
    (text: string, quickId?: string) => {
      const clean = text.trim();
      if (!clean) return;
      const c = copyRef.current;
      voice.stopSpeaking(); // el usuario interrumpe a la guía
      push({ role: "user", text: clean });
      setQuick([]);

      const step = stepRef.current;
      const intent = quickId ?? matchIntent(clean);
      const option = step === "options" ? matchOption(clean) : null;

      // Intenciones globales, en cualquier punto de la conversación.
      if (intent === "camera") {
        toggleCamera();
        return;
      }
      if (intent === "voice") {
        startConversation();
        setQuick(c.quickStart.slice(0, 2));
        return;
      }
      if (intent === "summary") {
        agentSay([c.statsIntro, c.statsCard, c.statsOutro], stepRef.current === "done" ? c.quickDone : []);
        return;
      }
      if (intent === "thanks") {
        agentSay([c.thanks]);
        return;
      }

      if (option) {
        routeOption(option);
        return;
      }

      switch (step) {
        case "intro":
          if (intent === "yes" || intent === "what") {
            stepRef.current = "options";
            agentSay([c.optionsIntro, c.optionsCard]);
            return;
          }
          if (intent === "later") {
            agentSay([c.later], c.quickLater);
            return;
          }
          break;
        case "launch":
          if (intent === "approve") {
            stepRef.current = "done";
            runLaunch();
            return;
          }
          if (intent === "adjust") {
            stepRef.current = "adjust";
            agentSay([c.adjustAsk], c.quickHours);
            return;
          }
          if (intent === "risks") {
            agentSay([c.risks], c.quickRisks);
            return;
          }
          break;
        case "adjust":
          if (intent === "h8" || intent === "h12" || intent === "h16" || intent === "approve") {
            if (intent === "approve") {
              stepRef.current = "done";
              runLaunch();
              return;
            }
            stepRef.current = "launch";
            const hours = intent === "h8" ? "8 h" : intent === "h16" ? "16 h" : "12 h";
            agentSay([c.adjusted(hours)], c.quickAdjusted);
            return;
          }
          break;
        default:
          if (intent === "yes") {
            stepRef.current = "options";
            agentSay([c.optionsIntro, c.optionsCard]);
            return;
          }
          break;
      }

      // Respuesta libre: reconocemos, y dejamos la puerta abierta.
      const fallback = c.fallback[fallbackIdxRef.current % c.fallback.length];
      fallbackIdxRef.current += 1;
      agentSay([fallback], step === "intro" ? c.quickStart : undefined);
    },
    [agentSay, push, routeOption, runLaunch, startConversation, toggleCamera, voice],
  );
  handleUserRef.current = handleUser;

  // Saludo inicial, una sola vez.
  useEffect(() => {
    aliveRef.current = true;
    if (!startedRef.current) {
      startedRef.current = true;
      const c = copyRef.current;
      wait(500).then(() => agentSay(c.greeting, c.quickStart));
    }
    return () => {
      aliveRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, quick]);

  const sendDraft = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    handleUser(text);
  };

  const acceptVoice = () => {
    const text = (voice.interim || draft).trim();
    voice.stopMic();
    setDraft("");
    if (text) handleUser(text);
  };

  const toggleSpeaker = () => {
    const next = !speakerOn;
    setSpeakerOn(next);
    speakerOnRef.current = next;
    if (!next) voice.stopSpeaking();
    pushSystem(next ? copy.ui.speakerOn : copy.ui.speakerOff);
  };

  const idle = !voice.speaking && !typing && !voice.micOn;
  const status = voice.speaking
    ? { label: copy.ui.statusSpeaking, color: "#30D158" }
    : typing
      ? { label: copy.ui.statusThinking, color: "#c98500" }
      : voice.micOn
        ? { label: copy.ui.statusListening, color: "#0A84FF" }
        : { label: copy.ui.statusOnline, color: "#30D158" };

  return (
    <div className="min-h-[100dvh] bg-[#0d0d0d]" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div className="relative mx-auto w-full max-w-[520px] h-[100dvh] flex flex-col">
        {/* Cabecera */}
        <header
          className="shrink-0 px-3 pb-2"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)" }}
        >
          <div className="h-11 flex items-center justify-between">
            <Link
              to="/"
              aria-label="Volver"
              className="w-10 h-10 rounded-full bg-[#1f1e1c] border border-white/10 flex items-center justify-center active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-5 h-5 text-[#f5f4ef]" />
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-semibold text-[#f5f4ef]">{copy.ui.title}</span>
              <ChevronDown className="w-4 h-4 text-[#898781]" />
            </div>
            <button
              type="button"
              aria-label={speakerOn ? copy.ui.speakerOff : copy.ui.speakerOn}
              onClick={toggleSpeaker}
              className="w-10 h-10 rounded-full bg-[#1f1e1c] border border-white/10 flex items-center justify-center active:scale-95 transition-transform"
            >
              {speakerOn ? (
                <Volume2 className="w-5 h-5 text-[#30D158]" />
              ) : (
                <VolumeX className="w-5 h-5 text-[#898781]" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#1f1e1c] border border-white/10 text-[13px] text-[#c3c2b7] whitespace-nowrap">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: status.color,
                  animation: "agent-pulse 1.8s ease-in-out infinite",
                }}
              />
              {status.label}
            </span>
            {idle ? (
              <span className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#1f1e1c] border border-white/10 text-[13px] text-[#c3c2b7] whitespace-nowrap">
                <Leaf className="w-3.5 h-3.5 text-[#30D158]" />
                {copy.ui.contextPill}
              </span>
            ) : null}
          </div>
        </header>

        {/* Conversación */}
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-4 py-4">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                lang={language}
                onCardAction={(optId) => {
                  const c = copyRef.current;
                  const opt =
                    c.optionsCard.kind === "options"
                      ? c.optionsCard.options.find((o) => o.id === optId)
                      : undefined;
                  handleUser(opt?.title ?? optId, optId);
                }}
              />
            ))}
            {typing ? <TypingDots /> : null}
            <div ref={endRef} />
          </div>
        </main>

        {/* Cámara en vivo (PiP) */}
        {cam.camOn ? (
          <button
            type="button"
            aria-label={copy.ui.camOff}
            onClick={toggleCamera}
            className="absolute right-3 z-40 w-[104px] h-[140px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
            style={{ top: "calc(env(safe-area-inset-top, 0px) + 116px)" }}
          >
            <video
              ref={cam.videoRef}
              muted
              playsInline
              autoPlay
              className="w-full h-full object-cover -scale-x-100"
            />
            <span className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/50 rounded-full px-2 py-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#30D158]"
                style={{ animation: "agent-pulse 1.6s ease-in-out infinite" }}
              />
              <span className="text-[10px] text-white font-medium uppercase tracking-wide">
                {copy.ui.live}
              </span>
            </span>
          </button>
        ) : null}

        {/* Zona inferior */}
        <div
          className="shrink-0"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
        >
          {voice.speaking ? (
            <div className="mx-3 mb-2 h-10 px-3.5 rounded-full bg-[#1a1a19] border border-white/10 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#30D158] shrink-0" />
              <span className="text-[13px] font-medium text-[#30D158] shrink-0">
                {copy.ui.guide}
              </span>
              <Waveform
                getLevel={voice.getTtsLevel}
                active
                color="#30D158"
                className="flex-1 h-6 min-w-0"
              />
              <span className="text-[11px] uppercase tracking-wide text-[#898781] shrink-0">
                {copy.ui.live}
              </span>
            </div>
          ) : null}

          {quick.length > 0 ? (
            <div className="flex gap-2 px-3 pb-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quick.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleUser(q.label, q.id)}
                  className="h-10 px-4 rounded-full bg-[#242422] border border-white/10 text-[15px] text-[#f5f4ef] whitespace-nowrap shrink-0 active:scale-95 transition-transform animate-[agent-fade-up_0.25s_ease-out_both]"
                >
                  {q.label}
                </button>
              ))}
            </div>
          ) : null}

          <Composer
            draft={draft}
            interim={voice.interim}
            listening={voice.micOn}
            camOn={cam.camOn}
            placeholder={copy.ui.placeholder}
            onDraftChange={setDraft}
            onSend={sendDraft}
            onMicStart={startConversation}
            onVoiceAccept={acceptVoice}
            onVoiceCancel={() => voice.stopMic()}
            onCamToggle={toggleCamera}
            onAttach={() => pushSystem(copy.ui.attachSoon)}
            getMicLevel={voice.getMicLevel}
          />
        </div>
      </div>
    </div>
  );
};
