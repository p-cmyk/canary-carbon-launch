import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export function FloatingHeader() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-4">
      <nav className="flex items-center justify-between h-12 gap-2">
        {/* Mobile Menu - Left side on mobile only */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/solutions" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    {t.nav.services}
                  </Button>
                </Link>
                <Link to="/technology" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    {t.nav.technology}
                  </Button>
                </Link>
                <Link to="/about" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    {t.nav.about}
                  </Button>
                </Link>
                <Link to="/live-data" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    {t.nav.liveData}
                  </Button>
                </Link>
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    {t.contact.title}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo - Next to menu on mobile */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              CanaryCarbon
            </span>
          </Link>
        </div>

        {/* Desktop Logo - Left side on desktop only */}
        <Link to="/" className="hidden md:flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            CanaryCarbon
          </span>
        </Link>

        {/* Center Navigation - Desktop only */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center h-12 bg-card/80 backdrop-blur-md border border-border rounded-full shadow-lg">
            <Link to="/solutions">
              <Button variant="ghost" className="h-12 rounded-full text-foreground hover:text-primary hover:bg-primary/10 transition-colors px-6">
                {t.nav.services}
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

        {/* Right side: Live Data (desktop only), Theme toggle, Language toggle */}
        <div className="flex items-center h-12 gap-4">
          {/* Live Data Button - Desktop only */}
          <Link to="/live-data" className="hidden md:block">
            <Button 
              variant="ghost" 
              className="h-12 text-live-data hover:text-live-data/80 font-semibold transition-colors bg-live-data/10 border border-live-data/30 rounded-full px-6"
            >
              {t.nav.liveData}
            </Button>
          </Link>
          
          {/* Theme and Language toggles - Always visible */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}