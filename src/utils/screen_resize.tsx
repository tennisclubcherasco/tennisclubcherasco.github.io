import { useEffect, useState } from "react";

const ScreenResize = (size: number): boolean => {
    const query = `(max-width: ${size}px)`;
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);

        const handleResize = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Aggiunge il listener
        mediaQueryList.addEventListener("change", handleResize);

        // Cleanup del listener
        return () => {
            mediaQueryList.removeEventListener("change", handleResize);
        };
    }, [query]);

    return matches;
};

export default ScreenResize;