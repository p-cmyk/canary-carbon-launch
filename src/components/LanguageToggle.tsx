import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LanguageToggle() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className="h-8 px-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm font-medium text-foreground"
    >
      {language === 'en' ? 'EN' : 'ES'}
    </Button>
  );
}