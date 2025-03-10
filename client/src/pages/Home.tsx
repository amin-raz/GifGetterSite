import { HeroSection } from "@/components/HeroSection";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { WebConverter } from "@/components/WebConverter";
import { WhyChoose } from "@/components/WhyChoose";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <Features />
      <WebConverter />
      <HowItWorks />
      <WhyChoose />
    </div>
  );
}