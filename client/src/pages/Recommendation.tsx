import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, RefreshCw, Plus, Tv, Film, Book, Music } from "lucide-react";
import { MediaItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const iconMap = {
  TV: Tv,
  Movie: Film,
  Book: Book,
  Music: Music,
};

const typeDisplayMap = {
  tv: "TV Shows",
  movie: "Movies", 
  book: "Books",
  music: "Music",
};

export default function Recommendation() {
  const { type } = useParams<{ type: string }>();
  const [genreFilter, setGenreFilter] = useState<string>("all");
  
  const getRandomRecommendation = useMutation({
    mutationFn: async ({ type, genre }: { type: string; genre?: string }) => {
      const params = new URLSearchParams();
      params.append("type", type);
      if (genre) params.append("genre", genre);
      
      const response = await apiRequest("GET", `/api/media/random?${params.toString()}`);
      return response.json();
    },
  });

  const handleGetRecommendation = () => {
    if (type) {
      getRandomRecommendation.mutate({ 
        type: type.toUpperCase(), 
        genre: genreFilter && genreFilter !== "all" ? genreFilter : undefined 
      });
    }
  };


  useState(() => {
    if (type) {
      handleGetRecommendation();
    }
  });

  const recommendation = getRandomRecommendation.data;
  const Icon = recommendation ? iconMap[recommendation.type as keyof typeof iconMap] : Tv;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <div className="flex items-center space-x-4">
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="w-40" data-testid="select-genre-filter">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                  <SelectItem value="comedy">Comedy</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="thriller">Thriller</SelectItem>
                  <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleGetRecommendation}
                variant="secondary"
                disabled={getRandomRecommendation.isPending}
                data-testid="button-get-another"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${getRandomRecommendation.isPending ? 'animate-spin' : ''}`} />
                Get Another
              </Button>
            </div>
          </div>

          <Card data-testid="card-recommendation">
            <CardContent className="p-8">
              {getRandomRecommendation.isPending ? (
                <div className="text-center py-8" data-testid="loading-recommendation">
                  <div className="w-6 h-6 border-3 border-transparent border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Finding a great recommendation...</p>
                </div>
              ) : getRandomRecommendation.error ? (
                <div className="text-center py-8" data-testid="error-no-recommendations">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No recommendations yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to add a {typeDisplayMap[type as keyof typeof typeDisplayMap]?.toLowerCase()} recommendation!
                  </p>
                  <Link href="/add">
                    <Button data-testid="button-add-first">
                      Add First {typeDisplayMap[type as keyof typeof typeDisplayMap]}
                    </Button>
                  </Link>
                </div>
              ) : recommendation ? (
                <div className="fade-in" data-testid="content-recommendation">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-primary w-8 h-8" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-3xl font-bold text-foreground" data-testid="text-recommendation-title">
                          {recommendation.title}
                        </h2>
                        <p className="text-accent font-medium" data-testid="text-recommendation-creator">
                          {recommendation.creator || 'Unknown Creator'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.genre && (
                          <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm" data-testid="text-recommendation-genre">
                            {recommendation.genre}
                          </span>
                        )}
                        {recommendation.year && (
                          <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm" data-testid="text-recommendation-year">
                            {recommendation.year}
                          </span>
                        )}
                        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm" data-testid="text-recommendation-type">
                          {recommendation.type}
                        </span>
                      </div>
                      <div className="flex space-x-3 pt-4">
                        <Button 
                          onClick={handleGetRecommendation}
                          disabled={getRandomRecommendation.isPending}
                          data-testid="button-get-another-recommendation"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${getRandomRecommendation.isPending ? 'animate-spin' : ''}`} />
                          Get Another
                        </Button>
                        <Link href="/add">
                          <Button variant="secondary" data-testid="button-add-similar">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Similar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
