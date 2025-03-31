import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { WebConverter } from "@/components/WebConverter";
import { WhyChoose } from "@/components/WhyChoose";
import { BottomCTA } from "@/components/BottomCTA";
import { SectionWithImage } from "@/components/SectionWithImage";
import { Features } from "@/components/Features";

const PlaceholderImage = () => (
  <div className="rounded-lg bg-muted/10 w-full aspect-video flex items-center justify-center text-muted-foreground">
    Placeholder Image
  </div>
);

export default function Home() {
  return (
    <div className="w-full space-y-12">
      <HeroSection />
      <HowItWorks />
      
      <SectionWithImage
        title="Create Perfect GIFs Every Time"
        description="Our advanced algorithms ensure your GIFs are optimized for quality and size. Perfect for sharing moments, reactions, and memories in Discord."
        content={<></>}
        image={<PlaceholderImage />}
        imagePosition="right"
      />

      <SectionWithImage
        title="Share Instantly"
        description="Once your GIF is ready, share it directly in any Discord channel. No need to download and upload - it's all seamless and instant."
        content={<></>}
        image={<PlaceholderImage />}
        imagePosition="left"
        background="bg-muted/5"
      />

      <WebConverter />
      <Features />
      <WhyChoose />
      <BottomCTA />
    </div>
  );
}