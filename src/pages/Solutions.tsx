import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";

const Solutions = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Nuestras Soluciones
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnologías innovadoras para la captura y conversión de CO₂ 
              en recursos valiosos para un futuro sostenible.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Captura Directa de Aire
              </h3>
              <p className="text-muted-foreground">
                Sistemas avanzados de captura directa de CO₂ del aire atmosférico 
                con eficiencia energética optimizada.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Conversión a Combustibles
              </h3>
              <p className="text-muted-foreground">
                Transformación del CO₂ capturado en combustibles sintéticos 
                y productos químicos de alto valor.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Solutions;