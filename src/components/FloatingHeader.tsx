import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function FloatingHeader() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-4">
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-xl font-bold text-foreground">CanaryCarbon</h1>
          </Link>
        </div>

        {/* Center Navigation with Background */}
        <div className="flex items-center">
          <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 shadow-lg">
            <Link to="/solutions">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                Solutions
              </Button>
            </Link>
            <Link to="/technology">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                Technology
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                About
              </Button>
            </Link>
          </div>
          
          {/* Live Data Button - Outside the background */}
          <Link to="/live-data">
            <Button 
              variant="ghost" 
              className="ml-4 text-live-data hover:text-live-data/80 font-semibold transition-colors bg-live-data/10 border border-live-data/30 rounded-full px-6"
            >
              Live Data
            </Button>
          </Link>
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