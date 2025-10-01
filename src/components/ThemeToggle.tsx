import { Moon, Sun, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="flex items-center h-full gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={`h-full px-3 transition-all duration-300 ${
          theme === 'dark' ? 'bg-accent/50' : 'hover:bg-accent/50'
        }`}
        onClick={() => setTheme('dark')}
        aria-label="Dark theme"
      >
        <Moon className="h-4 w-4 mr-1" />
        {t.theme.dark}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-full px-3 transition-all duration-300 ${
          theme === 'light' ? 'bg-accent/50' : 'hover:bg-accent/50'
        }`}
        onClick={() => setTheme('light')}
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4 mr-1" />
        {t.theme.light}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-full px-3 transition-all duration-300 ${
          theme === 'eco' ? 'bg-accent/50' : 'hover:bg-accent/50'
        }`}
        onClick={() => setTheme('eco')}
        aria-label="Eco theme"
      >
        <Leaf className="h-4 w-4 mr-1" />
        {t.theme.eco}
      </Button>
    </div>
  );
}