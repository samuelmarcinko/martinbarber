import Reveal from "./Reveal";
import { SnipDivider, ToolBackdrop } from "./BarberDecor";
import { siteConfig } from "../lib/siteConfig";

export default function BookingSection() {
  return (
    <section
      id="rezervacia"
      className="section booking"
      aria-labelledby="booking-title"
    >
      <ToolBackdrop variant="comb" className="tb-bl tb-comb" rotate={6} />
      <div className="container">
        <div className="booking-inner">
          <SnipDivider />
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

        <div id="kontakt" className="contact-2col">
          <Reveal className="contact-info">
            <p className="eyebrow">KDE NÁS NÁJDETE</p>
            <h3 className="display contact-heading">
              {siteConfig.name} · {siteConfig.city}
            </h3>
            <div className="contact-list">
              <div className="contact-item">
                <h4>Telefón</h4>
                <p>
                  <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                </p>
              </div>
              <div className="contact-item">
                <h4>Adresa</h4>
                <p>{siteConfig.address}</p>
              </div>
              <div className="contact-item">
                <h4>Rezervácia</h4>
                <p>Telefonicky alebo osobne</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="contact-photo" delay={0.12}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mb-adresa.avif"
              alt="Budova, v ktorej sídli Martin Barber — Weberova 11710/6, Prešov"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
