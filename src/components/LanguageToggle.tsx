import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-10 bg-transparent hover:bg-accent/50 transition-all duration-300"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4 text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-popover border-border" align="end">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="justify-start hover:bg-accent"
            onClick={() => setLanguage('es')}
          >
            <span className="mr-2">🇪🇸</span>
            {t.language.spanish}
            {language === 'es' && <span className="ml-auto">✓</span>}
          </Button>
          <Button
            variant="ghost"
            className="justify-start hover:bg-accent"
            onClick={() => setLanguage('en')}
          >
            <span className="mr-2">🇬🇧</span>
            {t.language.english}
            {language === 'en' && <span className="ml-auto">✓</span>}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}