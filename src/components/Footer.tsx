export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contacto</h3>
            <p className="text-muted-foreground mb-2">
              <a href="mailto:info@canary-carbon.com" className="hover:text-primary transition-colors">
                info@canary-carbon.com
              </a>
            </p>
          </div>

          {/* European Union */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Unión Europea</h3>
            <p className="text-sm text-muted-foreground">
              Proyecto cofinanciado por el Fondo Europeo de Desarrollo Regional (FEDER) 
              en el marco del Programa Operativo de Canarias 2014-2020.
            </p>
          </div>

          {/* Gobierno de Canarias */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Gobierno de Canarias</h3>
            <p className="text-sm text-muted-foreground">
              Con el apoyo del Gobierno de Canarias y la Agencia Canaria 
              de Investigación, Innovación y Sociedad de la Información.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 CanaryCarbon. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}