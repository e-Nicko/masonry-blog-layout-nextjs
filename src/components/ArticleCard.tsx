"use client";

import { Article } from "@/types/article";
import Image from "next/image";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className="article-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group w-full hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden h-48 w-full">
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={400}
          height={300}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {article.category}
          </span>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {article.title}
        </h2>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs hover:bg-gray-200 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="font-medium hover:text-gray-700 transition-colors duration-200">
              {article.author}
            </span>
            <span className="text-gray-400">•</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          <span className="bg-gray-50 px-2 py-1 rounded-md font-medium">
            {article.readTime} min read
          </span>
        </div>
      </div>

      {/* Subtle border on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-xl transition-colors duration-200 pointer-events-none" />
    </article>
  );
};
