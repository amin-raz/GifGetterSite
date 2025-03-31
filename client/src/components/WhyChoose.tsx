import { Check } from "lucide-react";
import { SectionWithImage } from "./SectionWithImage";

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
  const PlaceholderImage = (
    <div className="rounded-lg bg-muted/10 aspect-square flex items-center justify-center text-muted-foreground">
      Placeholder Image
    </div>
  );

  const benefitsContent = (
    <div className="space-y-6">
      {benefits.map((benefit) => (
        <div
          key={benefit.title}
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
        </div>
      ))}
    </div>
  );

  return (
    <SectionWithImage
      title="Why Choose GifGetter"
      content={benefitsContent}
      image={PlaceholderImage}
      imagePosition="right"
    />
  );
}