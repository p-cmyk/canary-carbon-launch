import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-bg-geothermal.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="CO2 Capture Technology" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Capturing Carbon,
          <br />
          <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
            Securing Tomorrow
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Revolutionary CO₂ capture technology that transforms industrial emissions 
          into valuable resources, creating a sustainable future for generations to come.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore Solutions
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div>
            <div className="text-4xl font-bold text-accent mb-2">95%</div>
            <div className="text-lg text-white/80">CO₂ Capture Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-glow mb-2">24/7</div>
            <div className="text-lg text-white/80">Continuous Operation</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-live-data mb-2">1M+</div>
            <div className="text-lg text-white/80">Tons CO₂ Captured</div>
          </div>
        </div>
      </div>
    </section>
  );
}