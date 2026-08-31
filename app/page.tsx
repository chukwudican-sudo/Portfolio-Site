import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Snapshot } from "@/components/Snapshot";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { getRoleLogos } from "@/lib/assets";
import { experience } from "@/lib/data";
import { Writing } from "@/components/Writing";
import { Places } from "@/components/Places";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  const roleLogos = getRoleLogos(experience.map((r) => r.id));

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-bg"
      style={{
        backgroundImage:
          "radial-gradient(1300px 760px at 50% -14%, rgba(224,138,92,0.085), transparent 64%), radial-gradient(900px 560px at 10% 6%, rgba(194,96,58,0.042), transparent 62%), radial-gradient(1000px 700px at 92% 40%, rgba(194,96,58,0.022), transparent 66%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: "radial-gradient(rgba(242,237,228,0.085) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(53deg, rgba(242,237,228,0.030) 0 1px, transparent 1px 3px), repeating-linear-gradient(127deg, rgba(242,237,228,0.024) 0 1px, transparent 1px 4px), repeating-linear-gradient(11deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)",
        }}
      />

      <Header />

      <main
        id="top"
        className="relative flex w-full flex-col gap-[clamp(92px,11vh,164px)] px-4 sm:px-[max(28px,calc((100%-var(--content-max))/2))]"
      >
        <Hero />
        <Snapshot />
        <ProjectsSection />
        <ExperienceSection logos={roleLogos} />
        <Writing />
        <Places />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
