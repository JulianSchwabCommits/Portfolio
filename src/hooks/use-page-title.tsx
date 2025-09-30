import { useEffect } from 'react';

const usePageTitle = () => {
  useEffect(() => {
    const originalTitle = "Julian's Portfolio";
    const awayTitle = "Comeback!!";
    const originalFavicon = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😊</text></svg>";
    const awayFavicon = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥺</text></svg>";
    
    const updateFavicon = (href: string) => {
      const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (existingFavicon) {
        existingFavicon.href = href;
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = awayTitle;
        updateFavicon(awayFavicon);
      } else {
        document.title = originalTitle;
        updateFavicon(originalFavicon);
      }
    };    
    // Set initial title and favicon
    document.title = originalTitle;
    updateFavicon(originalFavicon);
    
    // Add event listener for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Reset to original title and favicon when component unmounts
      document.title = originalTitle;
      updateFavicon(originalFavicon);
    };
  }, []);
};

export default usePageTitle;
