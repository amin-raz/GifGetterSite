import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { WebConverter } from "@/components/WebConverter";
import { WhyChoose } from "@/components/WhyChoose";
import { BottomCTA } from "@/components/BottomCTA";
import { SectionWithImage } from "@/components/SectionWithImage";
import { Features } from "@/components/Features";
import { Zap, Video, Share2, Smile } from "lucide-react";
import { motion } from "framer-motion";

const PlaceholderImage = () => (
  <div className="rounded-lg overflow-hidden shadow-lg border border-primary/10">
    <div className="bg-muted/10 w-full aspect-video flex items-center justify-center text-muted-foreground">
      Placeholder Image
    </div>
  </div>
);

export default function Home() {
  const fadeInAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="w-full">
      {/* Hero section */}
      <HeroSection />

      {/* How it works section */}
      <HowItWorks />

      {/* Core benefits with gradient background */}
      <section id="features" className="py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInAnimation}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Why You'll Love GifGetter
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Create perfect GIFs for Discord with these powerful features
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Convert videos to GIFs in seconds with our optimized processing"
              },
              {
                icon: Video,
                title: "High Quality",
                description: "Get crystal clear GIFs with perfect sizing for Discord sharing"
              },
              {
                icon: Share2,
                title: "Easy Sharing",
                description: "Share directly in Discord or download for use anywhere"
              },
              {
                icon: Smile,
                title: "Perfect Reactions",
                description: "Create custom reaction GIFs that express exactly what you want"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.5,
                      delay: i * 0.1
                    }
                  }
                }}
                className="bg-card rounded-xl p-6 shadow-md border border-primary/10 hover:border-primary/40 transition-colors duration-300"
              >
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature highlights with alternating layout */}
      <SectionWithImage
        title="Create Perfect GIFs Every Time"
        description="Our advanced algorithms ensure your GIFs are optimized for quality and size. Perfect for sharing moments, reactions, and memories in Discord."
        content={<></>}
        image={<PlaceholderImage />}
        imagePosition="right"
        className="py-24"
      />

      <SectionWithImage
        title="Share Instantly"
        description="Once your GIF is ready, share it directly in any Discord channel. No need to download and upload - it's all seamless and instant."
        content={<></>}
        image={<PlaceholderImage />}
        imagePosition="left"
        background="bg-muted/5"
        className="py-24"
      />

      {/* Web converter section */}
      <WebConverter />

      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
}