import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";
import { Partners } from "@/components/Partners";
import { useLanguage } from "@/contexts/LanguageContext";

const LiveData = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      <main className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t.liveData.title}
          </h1>
          <p className="text-2xl text-muted-foreground">
            {t.liveData.comingSoon}
          </p>
        </div>
      </main>
      <Partners />
      <Footer />
    </div>
  );
};

export default LiveData;