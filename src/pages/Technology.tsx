import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";
import { Partners } from "@/components/Partners";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Factory, Fuel, BarChart } from "lucide-react";

const Technology = () => {
  const { t } = useLanguage();

  const technologies = [
    {
      icon: Wind,
      title: t.technology.dac.title,
      description: t.technology.dac.description,
    },
    {
      icon: Factory,
      title: t.technology.occ.title,
      description: t.technology.occ.description,
    },
    {
      icon: Fuel,
      title: t.technology.efuels.title,
      description: t.technology.efuels.description,
    },
    {
      icon: BarChart,
      title: t.technology.monitoring.title,
      description: t.technology.monitoring.description,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          {t.technology.title}
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mb-12">
          {t.technology.intro}
        </p>

        {/* Technology Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {technologies.map((tech, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <tech.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-foreground">{tech.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base">
                  {tech.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Partners />
      <Footer />
    </div>
  );
};

export default Technology;