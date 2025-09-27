import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";

const LiveData = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              <span className="text-live-data">Datos en Tiempo Real</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitoreo en tiempo real de nuestros sistemas de captura de CO₂ 
              y métricas de rendimiento operacional.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 rounded-2xl border border-border text-center">
              <div className="text-3xl font-bold text-live-data mb-2">1,247</div>
              <div className="text-muted-foreground">Toneladas CO₂ Hoy</div>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border text-center">
              <div className="text-3xl font-bold text-primary mb-2">98.2%</div>
              <div className="text-muted-foreground">Eficiencia Actual</div>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border text-center">
              <div className="text-3xl font-bold text-accent mb-2">24/7</div>
              <div className="text-muted-foreground">Operación Continua</div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Estado del Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Planta Principal</span>
                <span className="text-accent font-semibold">Operativa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Unidad de Procesamiento</span>
                <span className="text-accent font-semibold">Operativa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sistema de Almacenamiento</span>
                <span className="text-accent font-semibold">Operativo</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LiveData;