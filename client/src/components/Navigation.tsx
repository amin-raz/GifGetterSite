import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <SiDiscord className="h-6 w-6" />
            <span className="font-bold text-xl">GifGetter</span>
          </a>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          <Link href="/feedback">
            <Button variant="ghost">Feedback</Button>
          </Link>
          <Button>
            Add to Discord
            <SiDiscord className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}