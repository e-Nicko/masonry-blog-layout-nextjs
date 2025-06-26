'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions<T> {
  fetchMore: (page: number) => Promise<{ items: T[]; hasMore: boolean }>;
  initialPage?: number;
  threshold?: number;
  rootMargin?: string;
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMoreRef: (node?: Element | null) => void;
  retry: () => void;
  reset: () => void;
}

export function useInfiniteScroll<T>({
  fetchMore,
  initialPage = 1,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const isInitialized = useRef(false);

  const { ref: loadMoreRef, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: false,
  });

  const loadInitialItems = useCallback(async () => {
    if (isInitialized.current) return;
    
    try {
      setLoading(true);
      setError(null);
      isInitialized.current = true;
      
      const response = await fetchMore(initialPage);
      setItems(response.items);
      setHasMore(response.hasMore);
      setPage(initialPage + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [fetchMore, initialPage]);

  const loadMoreItems = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;

    try {
      setLoadingMore(true);
      setError(null);
      
      const response = await fetchMore(page);
      setItems(prev => [...prev, ...response.items]);
      setHasMore(response.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more items');
    } finally {
      setLoadingMore(false);
    }
  }, [fetchMore, page, loadingMore, hasMore, loading]);

  const retry = useCallback(() => {
    if (items.length === 0) {
      isInitialized.current = false;
      loadInitialItems();
    } else {
      loadMoreItems();
    }
  }, [items.length, loadInitialItems, loadMoreItems]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    isInitialized.current = false;
    loadInitialItems();
  }, [initialPage, loadInitialItems]);

  // Initial load
  useEffect(() => {
    loadInitialItems();
  }, [loadInitialItems]);

  // Load more when in view
  useEffect(() => {
    if (inView && hasMore && !loadingMore && !loading && !error) {
      loadMoreItems();
    }
  }, [inView, hasMore, loadingMore, loading, error, loadMoreItems]);

  return {
    items,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMoreRef,
    retry,
    reset,
  };
}

