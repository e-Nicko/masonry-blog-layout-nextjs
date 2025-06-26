"use client";

import Masonry from "react-masonry-css";
import { ReactNode } from "react";

interface MasonryLayoutProps {
  children: ReactNode[];
  className?: string;
}

export const ReactMasonryGrid: React.FC<MasonryLayoutProps> = ({
  children,
  className = "",
}) => {
  const breakpointColumnsObj = {
    default: 3,
    3600: 6,
    2200: 5,
    1800: 4,
    1600: 3,
    700: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={`masonry-grid ${className}`}
      columnClassName="masonry-grid_column"
    >
      {children}
    </Masonry>
  );
};
