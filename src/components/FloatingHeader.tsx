import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

export function FloatingHeader() {
  const { t } = useLanguage();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-4">
      <nav className="flex items-center justify-between h-12 gap-8">
        {/* Left side: Image Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="CanaryCarbon" className="h-12" />
        </Link>

        {/* Center Navigation with Background */}
        <div className="flex-1 flex items-center justify-center">
          <div className="hidden md:flex items-center h-12 bg-card/80 backdrop-blur-md border border-border rounded-full shadow-lg">
            <Link to="/solutions">
              <Button variant="ghost" className="h-12 rounded-full text-foreground hover:text-primary hover:bg-primary/10 transition-colors px-6">
                {t.nav.solutions}
              </Button>
            </Link>
            <Link to="/technology">
              <Button variant="ghost" className="h-12 rounded-full text-foreground hover:text-primary hover:bg-primary/10 transition-colors px-6">
                {t.nav.technology}
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="h-12 rounded-full text-foreground hover:text-primary hover:bg-primary/10 transition-colors px-6">
                {t.nav.about}
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side: Live Data, Theme toggle, Language toggle */}
        <div className="flex items-center h-12 gap-4">
          {/* Live Data Button */}
          <Link to="/live-data">
            <Button 
              variant="ghost" 
              className="h-12 text-live-data hover:text-live-data/80 font-semibold transition-colors bg-live-data/10 border border-live-data/30 rounded-full px-6"
            >
              {t.nav.liveData}
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}