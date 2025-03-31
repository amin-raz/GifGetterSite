import { Video, Sparkles, Zap, Share2 } from "lucide-react";
import { SectionWithImage } from "./SectionWithImage";

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
  const featuresContent = (
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
  );

  return (
    <SectionWithImage
      title="Powerful Features"
      content={featuresContent}
      image={<PlaceholderImage />}
      imagePosition="right"
    />
  );
}