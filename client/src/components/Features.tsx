import { Card } from "@/components/ui/card";
import { Video, Sparkles, Zap, Share2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const PlaceholderImage = () => (
  <div className="rounded-lg bg-muted/10 w-full aspect-video flex items-center justify-center text-muted-foreground">
    Placeholder Image
  </div>
);

const features = [
  {
    title: "Easy Conversion",
    description: "Upload any video and get a perfectly optimized GIF in seconds",
    icon: Video,
  },
  {
    title: "Smart Processing",
    description: "Automatically adjusts quality and size for the best results",
    icon: Sparkles,
  },
  {
    title: "Lightning Fast",
    description: "Get your GIFs instantly with our optimized processing",
    icon: Zap,
  },
  {
    title: "Easy Sharing",
    description: "Share your GIFs directly in Discord or download them",
    icon: Share2,
  },
];

export function Features() {
  const shouldReduceMotion = useReducedMotion();

  const featureItem = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={featureItem}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
              Powerful Features
            </h2>
            <div className="space-y-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary/80" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={featureItem}
          >
            <PlaceholderImage />
          </motion.div>
        </div>
      </div>
    </section>
  );
}