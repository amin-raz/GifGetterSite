import { HeroSection } from "@/components/HeroSection";
import { Features } from "@/components/Features";
import { GifGallery } from "@/components/GifGallery";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Features />
      <GifGallery />
    </div>
  );
}
