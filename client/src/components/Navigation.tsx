import { Link, useLocation } from "wouter";
import { Share2, Plus } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Share2 className="text-primary-foreground text-sm" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NextUp
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`transition-colors ${location === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="link-nav-home"
            >
              Home
            </Link>
            <Link 
              href="/add" 
              className={`transition-colors ${location === '/add' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="link-nav-add"
            >
              Add Media
            </Link>
            <Link 
              href="/report" 
              className={`transition-colors ${location === '/report' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="link-nav-add"
            >
              Report Issue
            </Link>
          </nav>
          
          <Link 
            href="/add" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
            data-testid="button-add-media"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Media
          </Link>
        </div>
      </div>
    </header>
  );
}
