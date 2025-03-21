import { Check } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "No Software Required",
    description: "Convert videos directly in Discord without installing any additional software"
  },
  {
    title: "Optimized Output",
    description: "Get high-quality GIFs with optimal file size and frame rate"
  },
  {
    title: "Instant Processing",
    description: "Fast conversion ensures you get your GIFs within seconds"
  },
  {
    title: "Easy Sharing",
    description: "Share your GIFs instantly in Discord or download for use anywhere"
  }
];

export function WhyChoose() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Why Choose GifGetter
            </h2>
            <div className="space-y-6">
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <Check className="h-4 w-4 text-primary/80" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-muted/10 aspect-square flex items-center justify-center text-muted-foreground"
          >
            Placeholder Image
          </motion.div>
        </div>
      </div>
    </section>
  );
}