import { FloatingHeader } from "@/components/FloatingHeader";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { Partners } from "@/components/Partners";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      <HeroSection />
      <Partners />
      <Footer />
    </div>
  );
};

export default Index;
