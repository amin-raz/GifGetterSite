import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';

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
          <Button variant="ghost" className="flex items-center space-x-2 px-0">
            <SiDiscord className="h-6 w-6" />
            <span className="font-bold text-xl">GifGetter</span>
          </Button>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {authStatus === 'authenticated' && user ? (
            <div className="flex items-center space-x-4">
              <Link href="/feedback">
                <Button variant="ghost">Feedback</Button>
              </Link>
              <Link href="/converter">
                <Button variant="ghost">Web Converter</Button>
              </Link>
              <Avatar>
                <AvatarImage 
                  src={user.attributes?.picture} 
                  alt={user.username} 
                />
                <AvatarFallback>
                  {user.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => window.location.href = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/discord/callback')}&response_type=code&scope=identify`}
              variant="outline"
            >
              <SiDiscord className="mr-2 h-4 w-4" />
              Login with Discord
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}