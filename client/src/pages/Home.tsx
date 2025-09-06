import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import CategoryButton from "@/components/CategoryButton";
import MediaCard from "@/components/MediaCard";
import { MediaItem } from "@shared/schema";

export default function Home() {
  const { data: recentItems, isLoading } = useQuery<MediaItem[]>({
    queryKey: ["/api/media"],
  });

  const categories = [
    {
      type: "tv" as const,
      title: "TV Shows",
      description: "Discover binge-worthy series",
    },
    {
      type: "movie" as const,
      title: "Movies",
      description: "Find your next movie night pick",
    },
    {
      type: "book" as const,
      title: "Books",
      description: "Explore captivating stories",
    },
    {
      type: "music" as const,
      title: "Music",
      description: "Discover new sounds",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <section className="space-y-8">
          <div className="text-center space-y-4 mb-24 pt-24 pb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-normal pb-2 overflow-visible">
              Discover Amazing Content
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get personalized recommendations from the Web Surfing Studios community. 
              Find your next favorite show, movie, book, or song.
            </p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map((category) => (
              <CategoryButton
                key={category.type}
                type={category.type}
                title={category.title}
                description={category.description}
              />
            ))}
          </div>


          <div className="space-y-6">
            <h3 className="text-2xl font-semibold" data-testid="text-recent-picks-title">
              Recent Community Picks
            </h3>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-4 animate-pulse">
                    <div className="h-6 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentItems && recentItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-recent-picks">
                {recentItems.slice(0, 6).map((item) => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border" data-testid="text-no-recent-picks">
                <p className="text-muted-foreground mb-4">No community picks yet!</p>
                <p className="text-sm text-muted-foreground">Be the first to share your favorite media.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
