import Reveal from "./Reveal";

const steps = [
  {
    num: "01",
    title: "Konzultácia",
    body: "Najprv si prejdeme predstavu, štýl a výsledok, ktorý chceš dosiahnuť.",
  },
  {
    num: "02",
    title: "Remeslo",
    body: "Precízny strih alebo úprava brady s dôrazom na detail a čisté línie.",
  },
  {
    num: "03",
    title: "Výsledok",
    body: "Finálny styling a odporúčanie, ako si udržať svoj vzhľad aj doma.",
  },
];

export default function RitualSection() {
  return (
    <section
      className="section"
      style={{ background: "var(--bg-secondary)" }}
      aria-labelledby="ritual-title"
    >
      <div className="container">
        <div className="section-head">
          <Reveal>
            <p className="eyebrow">TVOJA NÁVŠTEVA</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="ritual-title" className="display section-title">
              Od prvého slova
              <br />
              po posledný detail.
            </h2>
          </Reveal>
        </div>

        <div className="ritual-grid">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.1}>
              <div className="ritual-step">
                <span className="ritual-num" aria-hidden>
                  {step.num}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
