import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import { getDiscordLoginUrl } from "@/lib/auth";

export function Navigation() {
  const { user, authStatus } = useAuthenticator();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          <ThemeToggle />
          {authStatus === 'authenticated' && user ? (
            <>
              <Link href="/feedback">
                <Button variant="ghost">Feedback</Button>
              </Link>
              <Avatar>
                <AvatarImage 
                  src={user.attributes?.picture} 
                  alt={user.username || 'User'} 
                />
                <AvatarFallback>
                  {user.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => window.location.href = getDiscordLoginUrl()}
              variant="outline"
            >
              <SiDiscord className="mr-2 h-4 w-4" />
              Login with Discord
            </Button>
          )}
          <a
            href="https://discord.com/oauth2/authorize?client_id=1299941868724949214"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              Add to Discord
              <SiDiscord className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}