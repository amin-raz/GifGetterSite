import { HeroSection } from "@/components/HeroSection";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyChoose } from "@/components/WhyChoose";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Features />
      <HowItWorks />
      <WhyChoose />
    </div>
  );
}