import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";
import { Partners } from "@/components/Partners";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import involcanGrey from "@/assets/partners/involcan_grey.png";
import involcanWhite from "@/assets/partners/involcan_white.png";
import { useTheme } from "@/contexts/ThemeContext";

const About = () => {
  const { t } = useLanguage();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          {t.about.title}
        </h1>
        
        <div className="max-w-4xl space-y-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.about.mission}
          </p>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.about.transform}
          </p>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.about.longTerm}
          </p>

          {/* Highlight Card */}
          <Card className="bg-primary/5 border-primary/20 mt-12">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img 
                  src={isDark ? involcanWhite : involcanGrey} 
                  alt="INVOLCAN" 
                  className="h-20 w-auto opacity-80"
                />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {t.about.spinoff}
                  </h3>
                  <p className="text-muted-foreground italic">
                    {t.about.tagline}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Partners />
      <Footer />
    </div>
  );
};

export default About;