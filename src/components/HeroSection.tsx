import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/10">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-foreground">{t.hero.title}</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </h1>
        
          <p className="text-xl text-muted-foreground max-w-3xl mb-12">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/solutions" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto">
                {t.hero.exploreSolutions}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Play className="mr-2 h-4 w-4" />
                {t.hero.watchDemo}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                95%
              </div>
              <p className="text-sm text-muted-foreground">{t.hero.stats.captureRate}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-sm text-muted-foreground">{t.hero.stats.operation}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                1M+
              </div>
              <p className="text-sm text-muted-foreground">{t.hero.stats.captured}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}