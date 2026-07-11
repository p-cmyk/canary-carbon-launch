import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentLang } from "./script";

// Tipado mínimo de la Web Speech API (no está en lib.dom para todos los targets).
interface RecognitionResultItem {
  transcript: string;
}
interface RecognitionResult {
  isFinal: boolean;
  0: RecognitionResultItem;
}
interface RecognitionEvent {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
}
interface RecognitionErrorEvent {
  error: string;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: RecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type RecognitionCtor = new () => SpeechRecognitionLike;

const getRecognitionCtor = (): RecognitionCtor | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

type UseVoiceOptions = {
  lang: AgentLang;
  onFinal: (text: string) => void;
};

export function useVoice({ lang, onFinal }: UseVoiceOptions) {
  const [micOn, setMicOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [interim, setInterim] = useState("");
  const [dictationSupported] = useState(() => getRecognitionCtor() !== null);

  const micOnRef = useRef(false);
  const speakingRef = useRef(false);
  const langRef = useRef(lang);
  const onFinalRef = useRef(onFinal);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const micLevelRef = useRef(0);
  const ttsLevelRef = useRef(0);
  const ttsQueueRef = useRef(0);
  const ttsRafRef = useRef(0);

  langRef.current = lang;
  onFinalRef.current = onFinal;

  const getMicLevel = useCallback(() => micLevelRef.current, []);
  const getTtsLevel = useCallback(() => ttsLevelRef.current, []);

  const startRecognition = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor || recognitionRef.current || speakingRef.current) return;
    try {
      const rec = new Ctor();
      rec.lang = langRef.current === "es" ? "es-ES" : "en-US";
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e) => {
        let interimText = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          const text = res[0]?.transcript ?? "";
          if (res.isFinal) {
            setInterim("");
            const clean = text.trim();
            if (clean) onFinalRef.current(clean);
          } else {
            interimText += text;
          }
        }
        if (interimText) setInterim(interimText);
      };
      rec.onend = () => {
        recognitionRef.current = null;
        setInterim("");
        // En modo continuo el navegador corta solo; relanzamos si seguimos activos.
        if (micOnRef.current && !speakingRef.current) {
          window.setTimeout(() => {
            if (micOnRef.current && !speakingRef.current) startRecognition();
          }, 300);
        }
      };
      rec.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          recognitionRef.current = null;
        }
      };
      recognitionRef.current = rec;
      rec.start();
    } catch {
      recognitionRef.current = null;
    }
  }, []);

  const stopRecognition = useCallback(() => {
    const rec = recognitionRef.current;
    recognitionRef.current = null;
    setInterim("");
    if (rec) {
      rec.onend = null;
      rec.onresult = null;
      try {
        rec.abort();
      } catch {
        /* ya parado */
      }
    }
  }, []);

  const startMic = useCallback(async (): Promise<boolean> => {
    if (micOnRef.current) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const w = window as unknown as {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const Ctx = w.AudioContext ?? w.webkitAudioContext;
      micOnRef.current = true;
      setMicOn(true);
      if (Ctx) {
        const ctx = new Ctx();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const loop = () => {
          if (!micOnRef.current) return;
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          micLevelRef.current = Math.min(1, rms * 4);
          rafRef.current = requestAnimationFrame(loop);
        };
        loop();
      }
      startRecognition();
      return true;
    } catch {
      return false;
    }
  }, [startRecognition]);

  const stopMic = useCallback(() => {
    micOnRef.current = false;
    setMicOn(false);
    micLevelRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    stopRecognition();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }, [stopRecognition]);

  const runTtsLevel = useCallback(() => {
    cancelAnimationFrame(ttsRafRef.current);
    const loop = () => {
      if (!speakingRef.current) {
        ttsLevelRef.current = 0;
        return;
      }
      const t = performance.now() / 1000;
      const wave =
        0.3 +
        0.35 * Math.abs(Math.sin(t * 6.3)) +
        0.25 * Math.abs(Math.sin(t * 2.1 + 1.4));
      ttsLevelRef.current = Math.min(1, wave);
      ttsRafRef.current = requestAnimationFrame(loop);
    };
    loop();
  }, []);

  const setSpeakingState = useCallback(
    (on: boolean) => {
      speakingRef.current = on;
      setSpeaking(on);
      if (on) {
        // Pausamos el reconocimiento para que el micro no transcriba a la guía.
        stopRecognition();
        runTtsLevel();
      } else {
        ttsLevelRef.current = 0;
        if (micOnRef.current) startRecognition();
      }
    },
    [runTtsLevel, startRecognition, stopRecognition],
  );

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const clean = text
        .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
        .replace(new RegExp("\\uFE0F", "g"), "")
        .replace(/[«»"]/g, "")
        .trim();
      if (!clean) return;
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = langRef.current === "es" ? "es-ES" : "en-US";
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) =>
        v.lang.toLowerCase().startsWith(langRef.current === "es" ? "es" : "en"),
      );
      if (match) utter.voice = match;
      utter.rate = 1.04;
      ttsQueueRef.current += 1;
      const done = () => {
        ttsQueueRef.current = Math.max(0, ttsQueueRef.current - 1);
        if (ttsQueueRef.current === 0) setSpeakingState(false);
      };
      utter.onstart = () => {
        if (!speakingRef.current) setSpeakingState(true);
      };
      utter.onend = done;
      utter.onerror = done;
      window.speechSynthesis.speak(utter);
    },
    [setSpeakingState],
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    ttsQueueRef.current = 0;
    window.speechSynthesis.cancel();
    if (speakingRef.current) setSpeakingState(false);
  }, [setSpeakingState]);

  useEffect(() => {
    // Algunos navegadores cargan las voces en diferido.
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      micOnRef.current = false;
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(ttsRafRef.current);
      const rec = recognitionRef.current;
      recognitionRef.current = null;
      if (rec) {
        rec.onend = null;
        try {
          rec.abort();
        } catch {
          /* ya parado */
        }
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close().catch(() => {});
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  return {
    micOn,
    speaking,
    interim,
    dictationSupported,
    startMic,
    stopMic,
    speak,
    stopSpeaking,
    getMicLevel,
    getTtsLevel,
  };
}
