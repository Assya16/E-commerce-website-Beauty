import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchSuggestion {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface SearchAutocompleteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchAutocomplete({ isOpen, onClose }: SearchAutocompleteProps) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions } = useQuery<SearchSuggestion[]>({
    queryKey: [`/api/search?q=${encodeURIComponent(query)}`],
    enabled: query.length >= 2,
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      onClose();
      setQuery("");
    }
  };

  const handleSelectProduct = (id: string) => {
    navigate(`/products/${id}`);
    onClose();
    setQuery("");
    setShowSuggestions(false);
  };

  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 w-40 md:w-64"
            data-testid="input-search-autocomplete"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-close-search"
        >
          <X className="h-4 w-4" />
        </Button>
      </form>

      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-popover-border rounded-lg shadow-lg overflow-hidden z-50">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelectProduct(product.id)}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
              data-testid={`suggestion-${product.id}`}
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
              </div>
              <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
            </button>
          ))}
          <button
            onClick={handleSearch}
            className="w-full p-3 text-sm text-center text-primary hover:bg-muted/50 transition-colors border-t"
            data-testid="button-see-all-results"
          >
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
