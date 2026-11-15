import { StitchBackground } from "@/components/landing/StitchBackground";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StorySection } from "@/components/landing/StorySection";
import { ValueProps } from "@/components/landing/ValueProps";
import { ModulesPreview } from "@/components/landing/ModulesPreview";
import { Methodology } from "@/components/landing/Methodology";
import { FaqSection } from "@/components/landing/FaqSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#05070b] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Google Stitch Dynamic Canvas Particle Grid + Continuous Flowing Neon Aurora */}
      <StitchBackground />

      {/* Navigation Header */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col">
        <HeroSection />
        <StorySection />
        <ValueProps />
        <ModulesPreview />
        <Methodology />
        <FaqSection />
      </main>

      {/* Footer & Final CTA */}
      <LandingFooter />
    </div>
  );
}
