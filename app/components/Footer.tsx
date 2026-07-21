import { nav, siteConfig } from "../lib/siteConfig";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">MARTIN BARBER</div>
          <p className="footer-tag">Pánske holičstvo v Prešove</p>
        </div>

        <nav className="footer-links" aria-label="Pätička">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <p className="footer-copy">
          © {year} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
