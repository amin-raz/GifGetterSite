import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { motion } from "framer-motion";

export function BottomCTA() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/5" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
          Ready to Transform Your GIFs?
        </h2>
        <Button 
          size="lg"
          className="group bg-[#5865F2] hover:bg-[#4752C4] transition-colors duration-300"
          onClick={() => window.open('https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=0&scope=bot', '_blank')}
        >
          <SiDiscord className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          Add to Discord
        </Button>
      </motion.div>
    </section>
  );
}