import Reveal from "./Reveal";
import { SnipDivider, ToolBackdrop } from "./BarberDecor";
import { services } from "../lib/siteConfig";

export default function ServicesSection() {
  return (
    <section id="sluzby" className="section" aria-labelledby="sluzby-title">
      <ToolBackdrop variant="scissors" className="tb-tr" rotate={14} />
      <div className="container">
        <div className="section-head">
          <SnipDivider />
          <Reveal>
            <p className="eyebrow">SLUŽBY</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="sluzby-title" className="display section-title">
              Klasické remeslo.
              <br />
              Moderný výsledok.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="section-intro">
              Od prvého pohľadu až po posledný detail. Každá návšteva je
              prispôsobená tebe, tvojmu štýlu a výsledku, ktorý chceš dosiahnuť.
            </p>
          </Reveal>
        </div>

        <ul className="services-grid">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal
                key={service.title}
                as="li"
                className="service-card"
                delay={(i % 3) * 0.09}
              >
                <Icon className="service-icon" aria-hidden strokeWidth={1.5} />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
