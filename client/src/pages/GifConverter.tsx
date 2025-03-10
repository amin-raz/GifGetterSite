import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GifUploader } from "@/components/GifUploader";

export default function GifConverter() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
  );
}