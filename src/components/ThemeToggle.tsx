import { Moon, Sun, Monitor, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
  eco: Leaf,
};

export function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const { t } = useLanguage();
  const Icon = themeIcons[theme];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-10 bg-transparent hover:bg-accent/50 transition-all duration-300"
          aria-label="Change theme"
        >
          <Icon className="h-4 w-4 text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-popover border-border" align="end">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="justify-start hover:bg-accent"
            onClick={() => setTheme('light')}
          >
            <Sun className="mr-2 h-4 w-4" />
            {t.theme.light}
            {theme === 'light' && <span className="ml-auto">✓</span>}
          </Button>
          <Button
            variant="ghost"
            className="justify-start hover:bg-accent"
            onClick={() => setTheme('dark')}
          >
            <Moon className="mr-2 h-4 w-4" />
            {t.theme.dark}
            {theme === 'dark' && <span className="ml-auto">✓</span>}
          </Button>
          <Button
            variant="ghost"
            className="justify-start hover:bg-accent"
            onClick={() => setTheme('system')}
          >
            <Monitor className="mr-2 h-4 w-4" />
            {t.theme.system}
            {theme === 'system' && <span className="ml-auto">✓</span>}
          </Button>
          <Button
            variant="ghost"
            className="justify-start hover:bg-accent"
            onClick={() => setTheme('eco')}
          >
            <Leaf className="mr-2 h-4 w-4" />
            {t.theme.eco}
            {theme === 'eco' && <span className="ml-auto">✓</span>}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}