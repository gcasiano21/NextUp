import { MediaItem } from "@shared/schema";
import { Tv, Film, Book, Music } from "lucide-react";

interface MediaCardProps {
  item: MediaItem;
}

const iconMap = {
  TV: Tv,
  Movie: Film,
  Book: Book,
  Music: Music,
};

export default function MediaCard({ item }: MediaCardProps) {
  const Icon = iconMap[item.type as keyof typeof iconMap] || Tv;

  return (
    <div className="media-card bg-card border border-border rounded-xl p-6 space-y-4" data-testid={`card-media-${item.id}`}>
      <div className="flex items-center justify-between">
        <Icon className="text-primary w-5 h-5" />
        <span className="text-xs text-muted-foreground" data-testid={`text-type-${item.id}`}>
          {item.type}
        </span>
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-1" data-testid={`text-title-${item.id}`}>
          {item.title}
        </h4>
        <p className="text-sm text-muted-foreground" data-testid={`text-creator-${item.id}`}>
          {item.creator || 'Unknown'}
        </p>
      </div>
      <div className="flex justify-between items-center">
        {item.genre ? (
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded" data-testid={`text-genre-${item.id}`}>
            {item.genre}
          </span>
        ) : (
          <span></span>
        )}
        {item.year ? (
          <span className="text-xs text-muted-foreground" data-testid={`text-year-${item.id}`}>
            {item.year}
          </span>
        ) : null}
      </div>
    </div>
  );
}
