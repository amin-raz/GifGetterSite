import { useAuthenticator } from '@aws-amplify/ui-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GifUploader } from "@/components/GifUploader";
import { useLocation } from "wouter";

export default function GifConverter() {
  const { authStatus } = useAuthenticator();
  const [, setLocation] = useLocation();

  // Redirect to home if not authenticated
  if (authStatus !== 'authenticated') {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Convert Video to GIF</CardTitle>
            </CardHeader>
            <CardContent>
              <GifUploader />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
