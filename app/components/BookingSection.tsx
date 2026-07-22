import Reveal from "./Reveal";
import { siteConfig } from "../lib/siteConfig";

export default function BookingSection() {
  return (
    <section
      id="rezervacia"
      className="section booking"
      aria-labelledby="booking-title"
    >
      <div className="container">
        <div className="booking-inner">
          <Reveal>
            <p className="eyebrow">TVOJ ČAS. TVOJ ŠTÝL.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="booking-title" className="display booking-title">
              Pripravený na svoj
              <br />
              ďalší strih?
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="section-intro">
              Vyber si termín a dopraj svojmu štýlu poctivú starostlivosť v
              Martin Barber.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="booking-actions">
              <a
                href={siteConfig.phoneHref}
                className="btn btn-primary"
                aria-label={`Rezervovať termín telefonicky na čísle ${siteConfig.phone}`}
              >
                Rezervovať termín
              </a>
              <span className="booking-sub">
                {siteConfig.name} · {siteConfig.city}
              </span>
            </div>
          </Reveal>
        </div>

        <div id="kontakt" className="contact-grid">
          <Reveal className="contact-item">
            <h4>Telefón</h4>
            <p>
              <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
            </p>
          </Reveal>
          <Reveal className="contact-item" delay={0.08}>
            <h4>Adresa</h4>
            <p>{siteConfig.address}</p>
          </Reveal>
          <Reveal className="contact-item" delay={0.16}>
            <h4>Rezervácia</h4>
            <p>Telefonicky alebo osobne</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
