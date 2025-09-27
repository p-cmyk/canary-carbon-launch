import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";

const Technology = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Nuestra Tecnología
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Investigación y desarrollo de vanguardia en captura de carbono 
              y tecnologías de conversión energética.
            </p>
          </header>

          <div className="space-y-8">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Proceso de Captura
              </h3>
              <p className="text-muted-foreground mb-4">
                Nuestro proceso utiliza tecnología de absorción química avanzada 
                para capturar CO₂ directamente del aire ambiente.
              </p>
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-primary font-semibold">
                  Eficiencia: 95% de captura de CO₂
                </p>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Innovación Continua
              </h3>
              <p className="text-muted-foreground">
                Investigamos constantemente nuevos materiales y métodos 
                para mejorar la eficiencia y reducir costos operativos.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Technology;