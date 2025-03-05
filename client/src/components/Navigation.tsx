import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from 'react';
import { getDiscordLoginUrl } from "@/lib/auth";

type User = {
  username: string;
  avatar?: string;
};

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on component mount
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(user => {
        setUser(user);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      window.location.href = '/';
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
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/feedback">
                    <Button variant="ghost">Feedback</Button>
                  </Link>
                  <Link href="/converter">
                    <Button variant="ghost">Web Converter</Button>
                  </Link>
                  <Avatar>
                    <AvatarImage 
                      src={user.avatar} 
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
                  onClick={() => window.location.href = getDiscordLoginUrl()}
                  variant="outline"
                >
                  <SiDiscord className="mr-2 h-4 w-4" />
                  Login with Discord
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}