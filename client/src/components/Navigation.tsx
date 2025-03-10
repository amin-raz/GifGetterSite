import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from 'react';
import { getCurrentUser, getDiscordLoginUrl } from "@/lib/auth";
import type { User } from "@shared/schema";

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
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

  const handleProtectedLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!user) {
      e.preventDefault();
      window.location.href = getDiscordLoginUrl(path);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center space-x-2 px-0">
            <SiDiscord className="h-6 w-6" />
            <span className="font-bold text-xl">GifGetter</span>
          </Button>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/feedback" onClick={(e) => handleProtectedLink(e, '/feedback')}>
            <Button variant="ghost">Feedback</Button>
          </Link>
          <Link href="/converter" onClick={(e) => handleProtectedLink(e, '/converter')}>
            <Button variant="ghost">Web Converter</Button>
          </Link>
          <ThemeToggle />
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Avatar>
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.username} />
                    ) : (
                      <AvatarFallback>
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">{user.username}</span>
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