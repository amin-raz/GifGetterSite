import { Button } from "@/components/ui/button";
import { Monitor, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export function WebConverter() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-16 bg-muted/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Web Converter
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Convert your videos to GIFs directly in your browser
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden p-8 flex flex-col items-center text-center">
            <div className="mb-6 p-4 rounded-full bg-primary/10">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Browser-Based Conversion
            </h3>
            <p className="text-muted-foreground mb-8">
              Don't want to use Discord? Use our web-based converter to transform your videos into high-quality GIFs instantly.
            </p>
            <Button 
              size="lg"
              onClick={() => setLocation('/converter')}
              className="group"
            >
              Try Web Converter
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}