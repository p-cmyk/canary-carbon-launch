// Contenido y tipos de la Guía — el copiloto conversacional de CanaryCarbon.
// Todo el texto vive aquí en los dos idiomas para que la interfaz quede limpia.

export type AgentLang = "es" | "en";

export type QuickReply = { id: string; label: string };

export type CardOption = {
  id: string;
  title: string;
  meta: string;
  badge?: string;
};

export type Ficha =
  | {
      kind: "options";
      title: string;
      subtitle?: string;
      options: CardOption[];
    }
  | {
      kind: "budget";
      title: string;
      items: { label: string; value: number }[];
      totalLabel: string;
      deltaLabel: string;
      deltaValue: number;
      footnote?: string;
    }
  | {
      kind: "hours";
      title: string;
      items: { label: string; hours: number }[];
      totalLabel: string;
      footnote?: string;
    }
  | {
      kind: "progress";
      title: string;
      steps: string[];
      done: number;
    }
  | {
      kind: "stats";
      title: string;
      stats: {
        label: string;
        value: string;
        hint?: string;
        tone?: "good" | "bad" | "neutral";
      }[];
    };

export type ChatMessage = {
  id: string;
  role: "user" | "agent" | "system";
  text?: string;
  card?: Ficha;
  time: string;
};

const es = {
  ui: {
    title: "Guía",
    subtitle: "IA · CanaryCarbon",
    contextPill: "CanaryCarbon · acceso total",
    statusOnline: "En línea",
    statusListening: "Te escucho…",
    statusThinking: "Pensando…",
    statusSpeaking: "Hablando…",
    placeholder: "Dile algo a la guía…",
    you: "Tú",
    guide: "Guía",
    live: "en vivo",
    voicePro: "Voz continua activada · función PRO",
    voiceOff: "Voz continua desactivada",
    camPro: "Cámara en vivo activada · función PRO · la guía te ve",
    camOff: "Cámara apagada",
    speakerOn: "Voz de la guía activada",
    speakerOff: "Voz de la guía silenciada",
    dictationNote:
      "El dictado no está disponible en este navegador; el micro muestra tu voz igualmente y puedes escribir.",
    micDenied: "No pude acceder al micrófono. Revisa los permisos.",
    camDenied: "No pude acceder a la cámara. Revisa los permisos.",
    attachSoon: "Fotos, archivos y pantalla: muy pronto",
    recommended: "Recomendado",
  },
  greeting: [
    "Hola Pablo 👋",
    "Estoy aquí. Tengo acceso al proyecto, al calendario y a los datos en vivo. ¿Repasamos lo importante de hoy?",
  ],
  quickStart: [
    { id: "yes", label: "Sí, vamos" },
    { id: "what", label: "¿Qué tienes?" },
    { id: "later", label: "Ahora no" },
  ],
  later:
    "Sin problema, me quedo en segundo plano. Deja la voz o la cámara abiertas y seguimos mientras haces otras cosas.",
  quickLater: [
    { id: "yes", label: "Va, enséñame" },
    { id: "voice", label: "Activa la voz" },
  ],
  optionsIntro: "Tengo 3 frentes abiertos. Te los ordeno por impacto:",
  optionsCard: {
    kind: "options",
    title: "Prioridades de hoy",
    subtitle: "Toca una para ver el plan con números.",
    options: [
      {
        id: "certs",
        title: "Certificados de captura en tiempo real",
        meta: "12 h · +8.400 € potenciales",
        badge: "Recomendado",
      },
      {
        id: "sensors",
        title: "Sensores CO₂ interior · lote 2",
        meta: "6 h · +2.900 €",
      },
      {
        id: "report",
        title: "Informe trimestral UE",
        meta: "9 h · vence en 5 días",
      },
    ],
  } as Ficha,
  budgetIntro: "Buena elección. Este es el plan con números reales:",
  budgets: {
    certs: {
      kind: "budget",
      title: "Certificados en tiempo real · plan",
      items: [
        { label: "Hardware de sensores", value: 3200 },
        { label: "Integración de datos", value: 2100 },
        { label: "Certificación externa", value: 900 },
      ],
      totalLabel: "Inversión total",
      deltaLabel: "Retorno estimado (90 días)",
      deltaValue: 8400,
      footnote: "Margen neto previsto: +2.200 € · 12 h de tu equipo",
    } as Ficha,
    sensors: {
      kind: "budget",
      title: "Sensores interior · lote 2",
      items: [
        { label: "Unidades con zeolitas", value: 1400 },
        { label: "Instalación", value: 800 },
        { label: "Calibración", value: 300 },
      ],
      totalLabel: "Inversión total",
      deltaLabel: "Retorno estimado (60 días)",
      deltaValue: 2900,
      footnote: "Margen neto previsto: +400 € · 6 h de tu equipo",
    } as Ficha,
  },
  hoursIntro: "Este no da dinero directo, pero vence en 5 días. Así lo repartiría:",
  hoursCard: {
    kind: "hours",
    title: "Informe trimestral UE · 9 h",
    items: [
      { label: "Recopilar datos de captura", hours: 3 },
      { label: "Redacción del informe", hours: 4 },
      { label: "Revisión legal", hours: 2 },
    ],
    totalLabel: "Total estimado",
    footnote: "Fecha límite: martes que viene",
  } as Ficha,
  launchAsk: "¿Lo lanzo? Te reservo las horas esta semana y aviso al equipo.",
  quickLaunch: [
    { id: "approve", label: "Aprobar ✓" },
    { id: "adjust", label: "Ajustar horas" },
    { id: "risks", label: "Ver riesgos" },
  ],
  risks:
    "Dos riesgos y cómo los cubro: 1) Stock de sensores justo — reservo hoy con devolución gratuita. 2) La certificadora va saturada — tengo hueco confirmado el jueves. ¿Aprobamos?",
  quickRisks: [
    { id: "approve", label: "Aprobar ✓" },
    { id: "adjust", label: "Ajustar horas" },
  ],
  adjustAsk: "¿Cuántas horas quieres dedicarle esta semana?",
  quickHours: [
    { id: "h8", label: "8 h" },
    { id: "h12", label: "12 h" },
    { id: "h16", label: "16 h" },
  ],
  adjusted: (h: string) => `Hecho, lo dejo en ${h}. ¿Lo lanzo?`,
  quickAdjusted: [
    { id: "approve", label: "Aprobar ✓" },
    { id: "risks", label: "Ver riesgos" },
  ],
  progressCard: {
    kind: "progress",
    title: "Poniéndolo en marcha",
    steps: [
      "Reservar horas del equipo",
      "Avisar a operaciones",
      "Pedir hardware",
      "Preparar borrador del certificado",
    ],
    done: 0,
  } as Ficha,
  launched:
    "Hecho ✅ Todo en marcha. Te aviso aquí cuando llegue el borrador. Puedes dejarme la voz abierta o encender la cámara y seguimos mientras trabajas.",
  quickDone: [
    { id: "summary", label: "Resumen del día" },
    { id: "camera", label: "Activa la cámara" },
    { id: "thanks", label: "Gracias" },
  ],
  thanks: "A ti. Sigo pendiente de todo — si pasa algo importante, te aviso yo.",
  cameraOn:
    "Te veo 👀 Sigue con lo tuyo, yo te acompaño. Si quieres que mire algo, dime «mira esto».",
  statsIntro: "La foto de hoy:",
  statsCard: {
    kind: "stats",
    title: "Resumen de hoy",
    stats: [
      { label: "CO₂ capturado", value: "4,2 t", hint: "+12% vs ayer", tone: "good" },
      { label: "Pipeline", value: "31,5 k€", hint: "3 propuestas", tone: "neutral" },
      { label: "Horas liberadas", value: "9 h", hint: "esta semana", tone: "good" },
    ],
  } as Ficha,
  statsOutro: "Día fuerte. ¿Algo más?",
  fallback: [
    "Apuntado. Lo tengo en el radar y te aviso con lo que encuentre.",
    "Hecho. ¿Quieres que te lo prepare en una ficha con números?",
    "Te escucho. Cuéntame más, o dime «resumen» para ver la foto del día.",
  ],
};

type Copy = typeof es;

const en: Copy = {
  ui: {
    title: "Guide",
    subtitle: "AI · CanaryCarbon",
    contextPill: "CanaryCarbon · full access",
    statusOnline: "Online",
    statusListening: "Listening…",
    statusThinking: "Thinking…",
    statusSpeaking: "Speaking…",
    placeholder: "Say something to the guide…",
    you: "You",
    guide: "Guide",
    live: "live",
    voicePro: "Continuous voice on · PRO feature",
    voiceOff: "Continuous voice off",
    camPro: "Live camera on · PRO feature · the guide can see you",
    camOff: "Camera off",
    speakerOn: "Guide voice on",
    speakerOff: "Guide voice muted",
    dictationNote:
      "Dictation isn't available in this browser; the mic still shows your voice and you can type.",
    micDenied: "I couldn't access the microphone. Check permissions.",
    camDenied: "I couldn't access the camera. Check permissions.",
    attachSoon: "Photos, files and screen: coming soon",
    recommended: "Recommended",
  },
  greeting: [
    "Hi Pablo 👋",
    "I'm here. I have access to the project, the calendar and the live data. Shall we go over what matters today?",
  ],
  quickStart: [
    { id: "yes", label: "Yes, let's go" },
    { id: "what", label: "What do you have?" },
    { id: "later", label: "Not now" },
  ],
  later:
    "No problem, I'll stay in the background. Leave voice or camera on and we'll keep going while you do other things.",
  quickLater: [
    { id: "yes", label: "Ok, show me" },
    { id: "voice", label: "Turn voice on" },
  ],
  optionsIntro: "I have 3 open fronts. Ordered by impact:",
  optionsCard: {
    kind: "options",
    title: "Today's priorities",
    subtitle: "Tap one to see the plan with numbers.",
    options: [
      {
        id: "certs",
        title: "Real-time capture certificates",
        meta: "12 h · +€8,400 potential",
        badge: "Recommended",
      },
      {
        id: "sensors",
        title: "Indoor CO₂ sensors · batch 2",
        meta: "6 h · +€2,900",
      },
      {
        id: "report",
        title: "EU quarterly report",
        meta: "9 h · due in 5 days",
      },
    ],
  },
  budgetIntro: "Good pick. Here's the plan with real numbers:",
  budgets: {
    certs: {
      kind: "budget",
      title: "Real-time certificates · plan",
      items: [
        { label: "Sensor hardware", value: 3200 },
        { label: "Data integration", value: 2100 },
        { label: "External certification", value: 900 },
      ],
      totalLabel: "Total investment",
      deltaLabel: "Estimated return (90 days)",
      deltaValue: 8400,
      footnote: "Expected net margin: +€2,200 · 12 h of your team",
    },
    sensors: {
      kind: "budget",
      title: "Indoor sensors · batch 2",
      items: [
        { label: "Zeolite units", value: 1400 },
        { label: "Installation", value: 800 },
        { label: "Calibration", value: 300 },
      ],
      totalLabel: "Total investment",
      deltaLabel: "Estimated return (60 days)",
      deltaValue: 2900,
      footnote: "Expected net margin: +€400 · 6 h of your team",
    },
  },
  hoursIntro: "This one brings no direct money, but it's due in 5 days. I'd split it like this:",
  hoursCard: {
    kind: "hours",
    title: "EU quarterly report · 9 h",
    items: [
      { label: "Collect capture data", hours: 3 },
      { label: "Write the report", hours: 4 },
      { label: "Legal review", hours: 2 },
    ],
    totalLabel: "Estimated total",
    footnote: "Deadline: next Tuesday",
  },
  launchAsk: "Shall I launch it? I'll block the hours this week and notify the team.",
  quickLaunch: [
    { id: "approve", label: "Approve ✓" },
    { id: "adjust", label: "Adjust hours" },
    { id: "risks", label: "See risks" },
  ],
  risks:
    "Two risks and how I cover them: 1) Sensor stock is tight — I reserve today with free returns. 2) The certifier is busy — I have a confirmed slot on Thursday. Approve?",
  quickRisks: [
    { id: "approve", label: "Approve ✓" },
    { id: "adjust", label: "Adjust hours" },
  ],
  adjustAsk: "How many hours do you want to spend on it this week?",
  quickHours: [
    { id: "h8", label: "8 h" },
    { id: "h12", label: "12 h" },
    { id: "h16", label: "16 h" },
  ],
  adjusted: (h: string) => `Done, setting it to ${h}. Shall I launch it?`,
  quickAdjusted: [
    { id: "approve", label: "Approve ✓" },
    { id: "risks", label: "See risks" },
  ],
  progressCard: {
    kind: "progress",
    title: "Setting it in motion",
    steps: [
      "Block the team's hours",
      "Notify operations",
      "Order hardware",
      "Draft the certificate",
    ],
    done: 0,
  },
  launched:
    "Done ✅ Everything is moving. I'll ping you here when the draft lands. Leave voice on or turn on the camera and we'll keep going while you work.",
  quickDone: [
    { id: "summary", label: "Today's summary" },
    { id: "camera", label: "Turn camera on" },
    { id: "thanks", label: "Thanks" },
  ],
  thanks: "Anytime. I'm keeping an eye on everything — if something matters, I'll ping you.",
  cameraOn:
    "I can see you 👀 Keep doing your thing, I'm right here. If you want me to look at something, say “look at this”.",
  statsIntro: "Today at a glance:",
  statsCard: {
    kind: "stats",
    title: "Today's summary",
    stats: [
      { label: "CO₂ captured", value: "4.2 t", hint: "+12% vs yesterday", tone: "good" },
      { label: "Pipeline", value: "€31.5k", hint: "3 proposals", tone: "neutral" },
      { label: "Hours freed", value: "9 h", hint: "this week", tone: "good" },
    ],
  },
  statsOutro: "Strong day. Anything else?",
  fallback: [
    "Noted. It's on my radar and I'll come back with what I find.",
    "Done. Want me to put it in a card with numbers?",
    "I'm listening. Tell me more, or say “summary” for today's picture.",
  ],
};

export const getCopy = (lang: AgentLang): Copy => (lang === "es" ? es : en);

export const formatEUR = (value: number, lang: AgentLang) =>
  new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

// Intención aproximada del texto libre (escrito o dictado), en ambos idiomas.
export const matchIntent = (text: string): string | null => {
  const t = text.toLowerCase().trim();
  if (/(aprobar|apruebo|apru[eé]balo|adelante|l[áa]nzalo|hazlo|approve|launch it|go ahead|do it)/.test(t))
    return "approve";
  if (/(riesgo|risk)/.test(t)) return "risks";
  if (/(resumen|summary)/.test(t)) return "summary";
  if (/(c[áa]mara|camera)/.test(t)) return "camera";
  if (/(gracias|thank)/.test(t)) return "thanks";
  if (/(ahora no|luego|m[áa]s tarde|not now|later)/.test(t)) return "later";
  if (/(ajustar|ajusta|cambiar horas|adjust|change hours)/.test(t)) return "adjust";
  if (
    /^(s[ií]|vale|venga|claro|ok|okay|va|yes|yeah|sure|yep)\b/.test(t) ||
    /(ens[eé]ñame|show me|qu[eé] tienes|what do you have)/.test(t)
  )
    return "yes";
  return null;
};

export const matchOption = (text: string): string | null => {
  const t = text.toLowerCase();
  if (/certificad|certificat/.test(t)) return "certs";
  if (/sensor/.test(t)) return "sensors";
  if (/informe|report/.test(t)) return "report";
  return null;
};
