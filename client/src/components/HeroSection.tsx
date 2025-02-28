import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { Video } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16">
      <div className="container relative">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
              Convert Videos to GIFs Directly in Discord
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl">
              GifGetter makes it easy to create and share GIFs without leaving Discord. Just upload a video and let our bot do the magic.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg">
                Add to Discord
                <SiDiscord className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
                <Video className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1586953208448-b95a79798f07"
              alt="Discord bot interface"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
