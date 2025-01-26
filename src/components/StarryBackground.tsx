import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  duration: number;
}

export const StarryBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create stars
    const stars: Star[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 50, // Only in top half
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }));

    // Create star elements
    stars.forEach((star) => {
      const starElement = document.createElement('div');
      starElement.className = 'star';
      starElement.style.left = `${star.x}%`;
      starElement.style.top = `${star.y}%`;
      starElement.style.width = `${star.size}px`;
      starElement.style.height = `${star.size}px`;
      starElement.style.setProperty('--duration', `${star.duration}s`);
      container.appendChild(starElement);
    });

    // Cleanup
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} className="stars-container" />;
}; 