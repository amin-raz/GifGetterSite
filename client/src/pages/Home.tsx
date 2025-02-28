import { HeroSection } from "@/components/HeroSection";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Features />
    </div>
  );
}