"use client";

import { Article } from "@/types/article";
import { getArticles } from "@/data/mockArticles";
import { ArticleCard } from "./ArticleCard";
import { ReactMasonryGrid } from "./ReactMasonryGrid";
import { LoadingSpinner, LoadingDots } from "./LoadingAnimations";
import { ErrorState, EmptyState } from "./ErrorState";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { motion } from "framer-motion";
import { Header } from "./Header";

export const BlogLayout: React.FC = () => {
  const fetchArticles = async (page: number) => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, page === 1 ? 1000 : 800)
    );

    // Fetch articles
    const response = getArticles(page, 12);
    return {
      items: response.articles,
      hasMore: response.hasMore,
    };
  };

  const {
    items: articles,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMoreRef,
    retry,
  } = useInfiniteScroll<Article>({
    fetchMore: fetchArticles,
    initialPage: 1,
    threshold: 0.1,
    rootMargin: "100px",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-[30px] py-8">
          <ErrorState error={error} onRetry={retry} />
        </main>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-[30px] py-8">
          <EmptyState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-[30px] py-8">
        <ReactMasonryGrid className="mb-8">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </ReactMasonryGrid>

        {/* Load More Trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loadingMore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-3"
              >
                <LoadingDots />
                <p className="text-gray-600 text-sm">
                  Loading more articles...
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* Error State for Load More */}
        {error && articles.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm">
              <p className="text-red-700 text-sm mb-2">{error}</p>
              <button
                onClick={retry}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* End Message */}
        {!hasMore && articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <span>🎉</span>
              <span>You&apos;ve reached the end!</span>
              <span>🎉</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {articles.length} articles loaded
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};
