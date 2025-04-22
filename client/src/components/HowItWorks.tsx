
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Wand2, Download } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Video",
    description: "Share your video file in any Discord channel where GifGetter is active"
  },
  {
    icon: Wand2,
    title: "Automatic Conversion",
    description: "Our bot instantly processes your video with optimal settings"
  },
  {
    icon: Download,
    title: "Get Your GIF",
    description: "Receive your perfectly optimized GIF ready to share"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Converting videos to GIFs has never been easier
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 rounded-full" />
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                } relative`}
              >
                <Card className="w-full max-w-md relative bg-card/50 backdrop-blur-sm border-primary/10">
                  <CardContent className="p-6">
                    <div className={`absolute top-1/2 -translate-y-1/2 bg-background rounded-full p-2 border-4 border-primary/20 ${index % 2 === 0 ? "-right-12" : "-left-12"}`}>
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-primary mb-1">Step {index + 1}</span>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
