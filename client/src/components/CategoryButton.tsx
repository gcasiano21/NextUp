import { Link } from "wouter";
import { Tv, Film, Book, Music } from "lucide-react";

interface CategoryButtonProps {
  type: "tv" | "movie" | "book" | "music";
  title: string;
  description: string;
}

const iconMap = {
  tv: Tv,
  movie: Film,
  book: Book,
  music: Music,
};

export default function CategoryButton({ type, title, description }: CategoryButtonProps) {
  const Icon = iconMap[type];

  return (
    <Link 
      href={`/recommendation/${type}`}
      className="category-card p-8 rounded-xl text-white text-center group block"
      data-testid={`button-category-${type}`}
    >
      <div className="space-y-4">
        <Icon className="w-10 h-10 mx-auto group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </Link>
  );
}
