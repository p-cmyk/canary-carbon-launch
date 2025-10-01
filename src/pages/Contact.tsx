import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";
import { Partners } from "@/components/Partners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    entity: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to a backend
    console.log("Form submitted:", formData);
    
    toast({
      title: t.contact.success,
      duration: 5000,
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      entity: "",
      message: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {t.contact.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t.contact.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg">
            <div className="space-y-2">
              <Label htmlFor="name">{t.contact.name}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t.contact.namePlaceholder}
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.contact.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t.contact.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entity">{t.contact.entity}</Label>
              <Input
                id="entity"
                name="entity"
                type="text"
                placeholder={t.contact.entityPlaceholder}
                value={formData.entity}
                onChange={handleChange}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t.contact.message}</Label>
              <Textarea
                id="message"
                name="message"
                placeholder={t.contact.messagePlaceholder}
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="bg-background/50 resize-none"
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              {t.contact.submit}
            </Button>
          </form>
        </div>
      </main>

      <Partners />
      <Footer />
    </div>
  );
};

export default Contact;
