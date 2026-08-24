import { Nav } from "@/components/Nav";
import { Greeting } from "@/components/sections/Greeting";
import { Hero } from "@/components/sections/Hero";
import { Agenda } from "@/components/sections/Agenda";
import { Rsvp } from "@/components/sections/Rsvp";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="shell">
      <Nav />
      <main id="main">
        <Greeting />
        <Hero />
        <Agenda />
        <Rsvp />
      </main>
      <Footer />
    </div>
  );
}
