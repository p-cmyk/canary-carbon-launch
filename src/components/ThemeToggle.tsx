import { Moon, Sun, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4 text-foreground" />;
      case 'light':
        return <Sun className="h-4 w-4 text-foreground" />;
      case 'eco':
        return <Leaf className="h-4 w-4 text-foreground" />;
      default:
        return <Leaf className="h-4 w-4 text-foreground" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-10 bg-transparent hover:bg-accent/50 transition-all duration-300"
          aria-label="Change theme"
        >
          {getThemeIcon()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-popover border-border" align="end">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="justify-start hover:bg-accent"
            onClick={() => setTheme('dark')}
          >
            <Moon className="h-4 w-4 mr-2" />
            {t.theme.dark}
            {theme === 'dark' && <span className="ml-auto">✓</span>}
          </Button>
          <Button
            variant="ghost"
            className="justify-start hover:bg-accent"
            onClick={() => setTheme('light')}
          >
            <Sun className="h-4 w-4 mr-2" />
            {t.theme.light}
            {theme === 'light' && <span className="ml-auto">✓</span>}
          </Button>
          <Button
            variant="ghost"
            className="justify-start hover:bg-accent"
            onClick={() => setTheme('eco')}
          >
            <Leaf className="h-4 w-4 mr-2" />
            {t.theme.eco}
            {theme === 'eco' && <span className="ml-auto">✓</span>}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}