import ScrollHero from "./components/ScrollHero";
import ServicesSection from "./components/ServicesSection";
import CraftSection from "./components/CraftSection";
import RitualSection from "./components/RitualSection";
import GallerySection from "./components/GallerySection";
import BookingSection from "./components/BookingSection";
import Footer from "./components/Footer";
import JsonLd from "./components/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd />
      <main>
        <ScrollHero />
        <ServicesSection />
        <CraftSection />
        <RitualSection />
        <GallerySection />
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
