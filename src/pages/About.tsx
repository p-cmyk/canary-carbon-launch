import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Sobre CanaryCarbon
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Liderando la innovación en tecnologías de captura de carbono 
              desde las Islas Canarias hacia el mundo.
            </p>
          </header>

          <div className="space-y-8">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Nuestra Misión
              </h3>
              <p className="text-muted-foreground">
                Desarrollar y implementar tecnologías de captura de CO₂ 
                que contribuyan significativamente a la mitigación del cambio climático, 
                creando al mismo tiempo oportunidades económicas sostenibles.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Nuestro Compromiso
              </h3>
              <p className="text-muted-foreground">
                Comprometidos con la investigación, la innovación y el desarrollo 
                de soluciones climáticas que marquen la diferencia para las futuras generaciones.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Ubicación Estratégica
              </h3>
              <p className="text-muted-foreground">
                Desde las Islas Canarias, aprovechamos las condiciones únicas 
                del archipiélago y su posición estratégica para desarrollar 
                tecnologías que puedan implementarse globalmente.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;