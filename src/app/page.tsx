import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Greeting } from "@/components/sections/Greeting";
import { Agenda } from "@/components/sections/Agenda";
import { Rsvp } from "@/components/sections/Rsvp";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="shell">
      <Nav />
      <main id="main">
        <Hero />
        <Greeting />
        <Agenda />
        <Rsvp />
      </main>
      <Footer />
    </div>
  );
}
