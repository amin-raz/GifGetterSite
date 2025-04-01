import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-40 pb-36 bg-[#36393f]/90 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-noise opacity-5"></div>
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(235,86%,65%),transparent_70%)] opacity-15"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/[1.1]">
              Convert Videos to GIFs Directly in Discord
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl max-w-[600px]">
              GifGetter makes it easy to create and share GIFs without leaving Discord. Just upload a video and let our bot do the magic.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://discord.com/oauth2/authorize?client_id=1299941868724949214"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] text-white border-none">
                  Add to Discord
                  <SiDiscord className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Button 
                size="lg" 
                className="bg-white/90 text-[#36393f] hover:bg-white hover:text-[#36393f] border-0"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See Features
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-video rounded-lg overflow-hidden shadow-2xl border border-gray-600"
          >
            <img 
              src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80"
              srcSet="
                https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=400&q=80 400w,
                https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80 800w,
                https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80 1200w
              "
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="Discord bot interface"
              className="object-cover w-full h-full"
              width="800"
              height="450"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}