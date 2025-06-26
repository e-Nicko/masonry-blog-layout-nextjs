'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface MasonryLayoutProps {
  children: React.ReactNode[];
  gap?: number;
  minColumnWidth?: number;
  className?: string;
}

interface ItemPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SimpleMasonryGrid: React.FC<MasonryLayoutProps> = ({
  children,
  gap = 24,
  minColumnWidth = 320,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [positions, setPositions] = useState<ItemPosition[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const calculateLayout = useCallback(() => {
    if (!containerRef.current || children.length === 0) return;

    const containerWidth = containerRef.current.offsetWidth;
    const numColumns = Math.max(1, Math.floor(containerWidth / minColumnWidth));
    const columnWidth = (containerWidth - (numColumns - 1) * gap) / numColumns;

    // Track column heights
    const columnHeights = new Array(numColumns).fill(0);
    const newPositions: ItemPosition[] = [];

    // Calculate positions for all items
    itemRefs.current.forEach((item, index) => {
      if (!item || index >= children.length) return;

      // Set width and get height
      item.style.width = `${columnWidth}px`;
      item.style.position = 'static';
      item.style.visibility = 'visible';
      
      const height = item.offsetHeight;

      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Calculate position
      const x = shortestColumnIndex * (columnWidth + gap);
      const y = columnHeights[shortestColumnIndex];

      newPositions[index] = {
        x,
        y,
        width: columnWidth,
        height,
      };

      // Update column height
      columnHeights[shortestColumnIndex] += height + gap;
    });

    setPositions(newPositions);
    setContainerHeight(Math.max(...columnHeights) - gap);
    setIsLayoutReady(true);
  }, [gap, minColumnWidth, children.length]);

  // Recalculate layout when children change
  useEffect(() => {
    setIsLayoutReady(false);
    const timeoutId = setTimeout(() => {
      calculateLayout();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [children.length, calculateLayout]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsLayoutReady(false);
      setTimeout(calculateLayout, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateLayout]);

  // Initial layout calculation
  useEffect(() => {
    if (children.length > 0) {
      setTimeout(calculateLayout, 100);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ 
        height: isLayoutReady ? containerHeight : 'auto',
        minHeight: '200px'
      }}
    >
      {children.map((child, index) => {
        const position = positions[index];
        
        return (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            style={{
              position: isLayoutReady && position ? 'absolute' : 'static',
              left: position?.x || 0,
              top: position?.y || 0,
              width: position?.width || '100%',
              marginBottom: isLayoutReady ? 0 : gap,
              opacity: isLayoutReady ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

