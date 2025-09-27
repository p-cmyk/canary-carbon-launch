import { FloatingHeader } from "@/components/FloatingHeader";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Index;
