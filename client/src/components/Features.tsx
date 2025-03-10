import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Sparkles, Zap, Share2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Everything you need to create perfect GIFs right in Discord
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item} className="relative">
              <Card className="h-full">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-foreground transition-colors" />
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed line-clamp-2">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}