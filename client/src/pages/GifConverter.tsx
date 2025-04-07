import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GifUploader } from "@/components/GifUploader";

export default function GifConverter() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="group transition-colors duration-300">
            <CardHeader>
              <CardTitle className="transition-colors duration-300 group-hover:text-primary">
                Convert Video to GIF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GifUploader />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}