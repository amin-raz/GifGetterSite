import { Card, CardContent } from "@/components/ui/card";

const exampleGifs = [
  {
    id: 1,
    title: "Gaming Highlight",
    image: "https://images.unsplash.com/photo-1527612820672-5b56351f7346",
  },
  {
    id: 2,
    title: "Meme Creation",
    image: "https://images.unsplash.com/photo-1529687891765-e1c10601a14f",
  },
  {
    id: 3,
    title: "Tutorial Demo",
    image: "https://images.unsplash.com/photo-1535231540604-72e8fbaf8cdb",
  },
];

export function GifGallery() {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
          Example Conversions
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exampleGifs.map((gif) => (
            <Card key={gif.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={gif.image}
                  alt={gif.title}
                  className="w-full aspect-video object-cover"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
