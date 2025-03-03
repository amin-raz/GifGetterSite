import { SiDiscord, SiGithub } from "react-icons/si";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold mb-3">About GifGetter</h3>
            <p className="text-muted-foreground">
              The easiest way to convert videos to GIFs directly within Discord.
              Perfect for gamers, content creators, and meme enthusiasts.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/feedback" className="text-muted-foreground hover:text-foreground transition-colors">
                  Submit Feedback
                </Link>
              </li>
              <li>
                <Link href="/converter" className="text-muted-foreground hover:text-foreground transition-colors">
                  Web Converter
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://discord.com/oauth2/authorize?client_id=1299941868724949214"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SiDiscord className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiGithub className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GifGetter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}