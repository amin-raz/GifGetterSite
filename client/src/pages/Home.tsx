import { HeroSection } from "@/components/HeroSection";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { WebConverter } from "@/components/WebConverter";
import { WhyChoose } from "@/components/WhyChoose";
import { BottomCTA } from "@/components/BottomCTA";
import { motion } from "framer-motion";

const PlaceholderImage = () => (
  <div className="rounded-lg bg-muted/10 w-full aspect-video flex items-center justify-center text-muted-foreground">
    Placeholder Image
  </div>
);

export default function Home() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="w-full space-y-12">
      <HeroSection />

      {/* Section 1: Create Perfect GIFs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Create Perfect GIFs Every Time
              </h2>
              <p className="text-lg text-muted-foreground">
                Our advanced algorithms ensure your GIFs are optimized for quality and size.
                Perfect for sharing moments, reactions, and memories in Discord.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
            >
              <PlaceholderImage />
            </motion.div>
          </div>
        </div>
      </section>

      <Features />

      {/* Section 2: Share Instantly */}
      <section className="py-12 bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="lg:order-2"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Share Instantly
              </h2>
              <p className="text-lg text-muted-foreground">
                Once your GIF is ready, share it directly in any Discord channel.
                No need to download and upload - it's all seamless and instant.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="lg:order-1"
            >
              <PlaceholderImage />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Web Converter */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Convert in Your Browser
              </h2>
              <p className="text-lg text-muted-foreground">
                Want to convert videos to GIFs directly in your browser? 
                Our web converter makes it easy and fast, with no downloads required.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
            >
              <PlaceholderImage />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="py-12 bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="lg:order-2"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Simple Process, Amazing Results
              </h2>
              <p className="text-lg text-muted-foreground">
                Converting videos to GIFs has never been easier. Upload your video,
                let our optimized processing handle the rest, and get perfect results every time.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="lg:order-1"
            >
              <PlaceholderImage />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5: Why Choose */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Why Choose GifGetter?
              </h2>
              <p className="text-lg text-muted-foreground">
                From seamless Discord integration to powerful conversion options,
                GifGetter is the ultimate tool for creating and sharing GIFs in your community.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
            >
              <PlaceholderImage />
            </motion.div>
          </div>
        </div>
      </section>

      <BottomCTA />
    </div>
  );
}