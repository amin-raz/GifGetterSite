import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Sparkles, Zap, Share2 } from "lucide-react";

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
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Everything you need to create perfect GIFs right in Discord
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}