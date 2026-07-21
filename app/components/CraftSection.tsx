import Reveal from "./Reveal";

const values = [
  {
    title: "PRECÍZNOSŤ",
    body: "Každá línia a každý prechod majú svoj dôvod.",
  },
  {
    title: "ATMOSFÉRA",
    body: "Priestor vytvorený tak, aby si sa cítil prirodzene a uvoľnene.",
  },
  {
    title: "CHARAKTER",
    body: "Výsledok, ktorý rešpektuje tvoj vzhľad a osobný štýl.",
  },
];

export default function CraftSection() {
  return (
    <section className="section" aria-labelledby="craft-title">
      <div className="container">
        <div className="craft-grid">
          <div>
            <Reveal>
              <p className="eyebrow">MIESTO S CHARAKTEROM</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="craft-title" className="display section-title">
                Viac než len strih.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="section-intro">
                Martin Barber spája klasické holičské remeslo s uvoľnenou
                atmosférou a interiérom, v ktorom má každý detail svoj príbeh.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="section-intro" style={{ marginTop: "1.1rem" }}>
                Je to miesto, kde na chvíľu vypneš, dopraješ si čas pre seba a
                odídeš s výsledkom, ktorý ti skutočne sedí.
              </p>
            </Reveal>

            <div className="craft-values">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={0.1 + i * 0.08}>
                  <div className="craft-value">
                    <h4>{v.title}</h4>
                    <p>{v.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.15}>
            <figure className="craft-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/gallery/gallery-02.jpg"
                alt="Detail interiéru barbershopu Martin Barber s barberskými kreslami a zrkadlami"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
