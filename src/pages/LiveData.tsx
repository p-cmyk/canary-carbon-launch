import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const LiveData = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          {t.liveData.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {t.liveData.description}
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default LiveData;