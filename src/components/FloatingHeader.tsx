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
      <nav className="flex items-center justify-between h-12">
        {/* Logo */}
        <div className="flex items-center h-full">
          <Link to="/" className="h-full flex items-center">
            <img src={logo} alt="CanaryCarbon" className="h-10" />
          </Link>
        </div>

        {/* Center Navigation with Background */}
        <div className="flex items-center h-full">
          <div className="hidden md:flex items-center h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 shadow-lg">
            <Link to="/solutions" className="h-full flex items-center">
              <Button variant="ghost" className="h-full text-foreground hover:text-primary transition-colors">
                {t.nav.solutions}
              </Button>
            </Link>
            <Link to="/technology" className="h-full flex items-center">
              <Button variant="ghost" className="h-full text-foreground hover:text-primary transition-colors">
                {t.nav.technology}
              </Button>
            </Link>
            <Link to="/about" className="h-full flex items-center">
              <Button variant="ghost" className="h-full text-foreground hover:text-primary transition-colors">
                {t.nav.about}
              </Button>
            </Link>
          </div>
          
          {/* Live Data Button - Outside the background */}
          <Link to="/live-data" className="h-full flex items-center ml-4">
            <Button 
              variant="ghost" 
              className="h-full text-live-data hover:text-live-data/80 font-semibold transition-colors bg-live-data/10 border border-live-data/30 rounded-full px-6"
            >
              {t.nav.liveData}
            </Button>
          </Link>
        </div>

        {/* Theme and Language toggles */}
        <div className="flex items-center h-full">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}