# Masonry Layout Implementation Guide

This guide explains the key techniques used to create the responsive, animated masonry layout in this project. The implementation relies on a combination of React components, a custom infinite scroll hook, and modern CSS for the layout itself.

## Core Components

The masonry functionality is primarily built from three key parts:

1.  **[`ReactMasonryGrid.tsx`](../src/components/ReactMasonryGrid.tsx)**: The component responsible for the CSS-based masonry structure.
2.  **[`BlogLayout.tsx`](../src/components/BlogLayout.tsx)**: The main layout that fetches data and orchestrates the grid and infinite scroll.
3.  **[`useInfiniteScroll.ts`](../src/hooks/useInfiniteScroll.ts)**: A custom React Hook that handles the logic for loading more articles as the user scrolls.

---

### 1. [`ReactMasonryGrid.tsx`](../src/components/ReactMasonryGrid.tsx) - The CSS-Powered Grid

The foundation of the layout is a CSS-only masonry implementation, which is highly performant because it avoids complex JavaScript-based position calculations.

```tsx
// src/components/ReactMasonryGrid.tsx

"use client";

import Masonry from "react-masonry-css";
import { ReactNode } from "react";

// ...

export const ReactMasonryGrid: React.FC<MasonryLayoutProps> = ({
  children,
}) => {
  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {children}
    </Masonry>
  );
};
```

**Key Concepts:**

- **`react-masonry-css` Library**: This lightweight library provides a simple React component that generates the necessary column-based structure for a masonry layout.
- **`breakpointCols`**: This object defines the number of columns to display at different screen widths. For example, screens wider than `1100px` will have 3 columns, while screens between `700px` and `1100px` will have 2.
- **CSS Styling ([`globals.css`](../src/app/globals.css))**: The actual masonry effect is achieved with simple CSS. The `masonry-grid` class uses `display: flex;`, and each `masonry-grid_column` acts as a container for the items in that column.

---

### 2. [`BlogLayout.tsx`](../src/components/BlogLayout.tsx) - Orchestrating the Content

This component acts as the main container. It's responsible for fetching the articles and feeding them into the masonry grid.

```tsx
// src/components/BlogLayout.tsx

// ... (imports)

export const BlogLayout: React.FC = () => {
  const {
    items: articles,
    // ... (other state from hook)
  } = useInfiniteScroll<Article>({
    fetchMore: fetchArticles,
    // ...
  });

  // ... (loading and error states)

  return (
    // ...
    <main>
      <ReactMasonryGrid>
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </ReactMasonryGrid>
      // ... (load more trigger)
    </main>
    // ...
  );
};
```

**Key Responsibilities:**

- **Data Fetching**: It uses the `useInfiniteScroll` hook to fetch pages of articles.
- **State Management**: It handles loading, error, and empty states.
- **Rendering**: It maps over the fetched `articles` and renders an `ArticleCard` for each one, passing the `index` to allow for staggered animations.

---

### 3. [`useInfiniteScroll.ts`](../src/hooks/useInfiniteScroll.ts) - The Infinite Scroll Logic

This custom hook encapsulates all the logic needed for infinite scrolling.

```tsx
// src/hooks/useInfiniteScroll.ts

// ... (imports)

export const useInfiniteScroll = <T>({ fetchMore, ... }) => {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // ... (loading and error state)

  const loadMoreRef = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreItems();
    }
  }, [inView]);

  // ... (fetch logic)

  return { items, loadMoreRef, hasMore, loading, error, retry };
};

```

**Key Features:**

- **`react-intersection-observer` (`useInView`)**: This is the core of the infinite scroll detection. It provides a `ref` (`loadMoreRef`) that you can attach to an element at the bottom of the list. When that element scrolls into the viewport, the hook triggers a new data fetch.
- **State Management**: It manages the list of `items`, the current `page` number, and whether there are `hasMore` items to load.
- **Generic Type `<T>`**: The hook is generic, meaning it can be used to infinitely scroll any type of data, not just articles.

By combining these three parts, the project achieves a performant, responsive, and modern-feeling masonry blog layout.
