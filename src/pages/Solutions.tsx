import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";
import { Partners } from "@/components/Partners";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Ship, Droplets } from "lucide-react";

const Solutions = () => {
  const { t } = useLanguage();

  const solutions = [
    {
      icon: Leaf,
      title: t.solutions.cards.dac.title,
      description: t.solutions.cards.dac.description,
    },
    {
      icon: Ship,
      title: t.solutions.cards.occ.title,
      description: t.solutions.cards.occ.description,
    },
    {
      icon: Droplets,
      title: t.solutions.cards.efuels.title,
      description: t.solutions.cards.efuels.description,
    },
  ];

  const services = [
    t.solutions.servicesList.environmental,
    t.solutions.servicesList.certificates,
    t.solutions.servicesList.modeling,
    t.solutions.servicesList.integration,
    t.solutions.servicesList.consulting,
    t.solutions.servicesList.training,
    t.solutions.servicesList.measurement,
    t.solutions.servicesList.airTreatment,
    t.solutions.servicesList.visualization,
  ];

  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          {t.solutions.title}
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mb-12">
          {t.solutions.intro}
        </p>

        {/* Solutions Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {solutions.map((solution, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <solution.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-foreground">{solution.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {solution.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services List */}
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            {t.solutions.services}
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            {services.map((service, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Partners />
      <Footer />
    </div>
  );
};

export default Solutions;