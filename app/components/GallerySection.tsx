import Reveal from "./Reveal";

const images = [
  {
    src: "/images/martinbarber-start.png",
    alt: "Vstupný a čakací priestor barbershopu Martin Barber v Prešove",
    className: "gallery-a",
  },
  {
    src: "/images/gallery/gallery-01.jpg",
    alt: "Pohľad do interiéru Martin Barber smerom k pracovným miestam",
    className: "gallery-b",
  },
  {
    src: "/images/gallery/gallery-03.jpg",
    alt: "Barberské kreslá a zrkadlá v priestore Martin Barber",
    className: "gallery-c",
  },
  {
    src: "/images/martinbarber-end.png",
    alt: "Centrálna ulička a pracovné miesta v barbershope Martin Barber",
    className: "gallery-d",
  },
  {
    src: "/images/gallery/gallery-04.jpg",
    alt: "Detail drevených prvkov a atmosféry v Martin Barber",
    className: "gallery-e",
  },
];

export default function GallerySection() {
  return (
    <section id="atmosfera" className="section" aria-labelledby="gallery-title">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <p className="eyebrow">ATMOSFÉRA</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="gallery-title" className="display section-title">
              Priestor, ktorý patrí
              <br />
              k celému zážitku.
            </h2>
          </Reveal>
        </div>

        <div className="gallery-grid">
          {images.map((img, i) => (
            <Reveal
              key={img.src}
              className={`gallery-item ${img.className}`}
              delay={(i % 3) * 0.08}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
