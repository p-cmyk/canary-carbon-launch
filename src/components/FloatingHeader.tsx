import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/button";

export function FloatingHeader() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-4">
      <nav className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-lg">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-foreground">CanaryCarbon</h1>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
            Solutions
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
            Technology
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
            About
          </Button>
          <Button 
            variant="ghost" 
            className="text-live-data hover:text-live-data/80 font-semibold transition-colors"
          >
            Live Data
          </Button>
        </div>

        {/* Theme and Language toggles */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}