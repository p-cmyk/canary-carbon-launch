import { Link } from "react-router-dom";
import { AudioLines } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Acceso directo a la Guía: botón flotante siempre visible en la landing.
export const AgentFab = () => {
  const { language } = useLanguage();
  return (
    <Link
      to="/agente"
      aria-label={language === "es" ? "Hablar con la guía" : "Talk to the guide"}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 h-14 pl-4 pr-5 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
    >
      <AudioLines className="w-6 h-6" />
      <span className="text-[15px] font-semibold">
        {language === "es" ? "Guía" : "Guide"}
      </span>
    </Link>
  );
};
