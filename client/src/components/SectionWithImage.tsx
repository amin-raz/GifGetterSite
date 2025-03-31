import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionWithImageProps {
  title: string;
  description?: string;
  content: ReactNode;
  image: ReactNode;
  imagePosition?: "left" | "right";
  className?: string;
  background?: string;
}

export function SectionWithImage({
  title,
  description,
  content,
  image,
  imagePosition = "right",
  className = "",
  background = "bg-background"
}: SectionWithImageProps) {
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
    <section className={`py-12 ${background} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {imagePosition === "left" ? (
            <>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeInAnimation}
                className="order-2 lg:order-1"
              >
                {image}
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeInAnimation}
                className="order-1 lg:order-2"
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                  {title}
                </h2>
                {description && (
                  <p className="text-muted-foreground mb-6">{description}</p>
                )}
                {content}
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeInAnimation}
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                  {title}
                </h2>
                {description && (
                  <p className="text-muted-foreground mb-6">{description}</p>
                )}
                {content}
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeInAnimation}
              >
                {image}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}