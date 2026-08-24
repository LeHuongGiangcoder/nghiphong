import { Nav } from "@/components/Nav";
import { Greeting } from "@/components/sections/Greeting";
import { Hero } from "@/components/sections/Hero";
import { Agenda } from "@/components/sections/Agenda";
import { Rsvp } from "@/components/sections/Rsvp";
import { Footer } from "@/components/sections/Footer";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <div className="shell">
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
  );
}
