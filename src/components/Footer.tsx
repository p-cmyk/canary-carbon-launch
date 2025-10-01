import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              <strong>{t.footer.contact}:</strong> info@canary-carbon.com
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CanaryCarbon. {t.footer.allRightsReserved}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}