import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-card to-secondary/20" />
      <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.1),transparent_50%)]" />

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          {t.hero.title}
          <br />
          <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
            {t.hero.titleHighlight}
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          {t.hero.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t.hero.exploreSolutions}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
          >
            <Play className="mr-2 h-5 w-5" />
            {t.hero.watchDemo}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-accent mb-2">95%</div>
            <div className="text-lg text-muted-foreground">{t.hero.stats.captureRate}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-glow mb-2">24/7</div>
            <div className="text-lg text-muted-foreground">{t.hero.stats.operation}</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-live-data mb-2">1M+</div>
            <div className="text-lg text-muted-foreground">{t.hero.stats.captured}</div>
          </div>
        </div>
      </div>
    </section>
  );
}