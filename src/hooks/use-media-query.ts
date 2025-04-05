
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set the initial value
    setMatches(media.matches);
    
    // Create a handler function
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Add the event listener
    media.addEventListener("change", handler);
    
    // Clean up
    return () => media.removeEventListener("change", handler);
  }, [query]);
  
  return matches;
}
