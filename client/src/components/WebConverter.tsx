import { Button } from "@/components/ui/button";
import { Monitor, ArrowRight, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export function WebConverter() {
  const [, setLocation] = useLocation();

  const fadeInAnimation = {
    hidden: { opacity: 0, y: 20 },
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
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInAnimation}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
              Web Converter
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Don't want to use Discord? We've got you covered. Use our web-based converter to transform your videos into high-quality GIFs instantly.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "No account required",
                "High-quality output",
                "Fast processing",
                "Simple and intuitive interface"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <Video className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              size="lg"
              onClick={() => setLocation('/converter')}
              className="group bg-[#7289da] hover:bg-[#5d73c7] text-white border-none shadow-md"
            >
              Try Web Converter
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInAnimation}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/40 rounded-lg blur-lg opacity-75"></div>
            <div className="relative bg-card rounded-lg shadow-lg overflow-hidden p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <Monitor className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Browser-Based Conversion
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Our web converter provides a seamless experience for transforming your videos into GIFs without any software installation.
              </p>
              <div className="w-full h-32 bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                Preview Interface
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}