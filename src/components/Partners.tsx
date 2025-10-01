import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import autoridadPortuariaGrey from "@/assets/partners/autoridad_portuaria_grey.png";
import autoridadPortuariaWhite from "@/assets/partners/autoridad_portuaria_white.png";
import gobiernoCanariasGrey from "@/assets/partners/gobierno_canarias_grey.png";
import gobiernoCanariasWhite from "@/assets/partners/gobierno_canarias_white.png";
import involcanGrey from "@/assets/partners/involcan_grey.png";
import involcanWhite from "@/assets/partners/involcan_white.png";
import turismoCanariasGrey from "@/assets/partners/turismo_canarias_grey.png";
import turismoCanariasWhite from "@/assets/partners/turismo_canarias_white.png";
import universidadLagunaGrey from "@/assets/partners/universidad_laguna_grey.png";
import universidadLagunaWhite from "@/assets/partners/universidad_laguna_white.png";
export function Partners() {
  const {
    effectiveTheme
  } = useTheme();
  const {
    t
  } = useLanguage();
  const isDark = effectiveTheme === 'dark';
  const partners = [{
    grey: autoridadPortuariaGrey,
    white: autoridadPortuariaWhite,
    alt: "Autoridad Portuaria SC Tenerife"
  }, {
    grey: gobiernoCanariasGrey,
    white: gobiernoCanariasWhite,
    alt: "Gobierno de Canarias"
  }, {
    grey: involcanGrey,
    white: involcanWhite,
    alt: "INVOLCAN"
  }, {
    grey: turismoCanariasGrey,
    white: turismoCanariasWhite,
    alt: "Turismo de Islas Canarias"
  }, {
    grey: universidadLagunaGrey,
    white: universidadLagunaWhite,
    alt: "Universidad de La Laguna"
  }];
  return <section className="py-16 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
          {t.partners.title}
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-12 mb-8">
          {partners.map((partner, index) => <div key={index} className="h-16 flex items-center">
              <img src={isDark ? partner.white : partner.grey} alt={partner.alt} className="h-full w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </div>)}
        </div>
        <p className="text-center text-muted-foreground">
          {t.partners.interested}{" "}
          <a href="mailto:hello@canary-carbon.com" className="text-primary hover:underline">info@canary-carbon.com</a>
        </p>
      </div>
    </section>;
}