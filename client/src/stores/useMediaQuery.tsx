import { useEffect, useState } from "react"

export default function useMediaQuery(query?: string): boolean {
    if (!query) {
        query = "(max-width: 768px)"
    }
    const [matches, setMatches] = useState(false)
  
    useEffect(() => {
      const media = window.matchMedia(query)
      
      // Set the initial value
      setMatches(media.matches)
  
      // Define our event listener
      const listener = () => setMatches(media.matches)
  
      // Add the listener to begin watching for changes
      media.addListener(listener)
  
      // Clean up the listener when the component unmounts
      return () => media.removeListener(listener)
    }, [query])
  
    return matches
  }
  