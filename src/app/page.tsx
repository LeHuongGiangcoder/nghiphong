import { Nav } from "@/components/Nav";
import { Cover } from "@/components/sections/Cover";
import { Greeting } from "@/components/sections/Greeting";
import { Hero } from "@/components/sections/Hero";
import { Agenda } from "@/components/sections/Agenda";
import { Rsvp } from "@/components/sections/Rsvp";
import { Footer } from "@/components/sections/Footer";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <div className="shell">
      <Cover />

      {/* The invitation proper — everything the cover gates. It is wrapped so
          the cover has one element to mark `inert` while it is up; the div is
          layout-neutral, and the nav is fixed, so it sits outside this box
          anyway. */}
      <div id="invitation">
        <Nav />
        <main id="main">
          <Greeting />
          <Hero />
          <SectionDivider />
          <Agenda />

          <Rsvp />
        </main>
        <Footer />
      </div>
    </div>
  );
}
