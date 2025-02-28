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
    <section id="why-choose" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Why Choose GifGetter
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            The smart choice for Discord GIF creation
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Check className="h-4 w-4 text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
