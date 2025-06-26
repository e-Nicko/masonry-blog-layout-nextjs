"use client";

import { Article } from "@/types/article";
import Image from "next/image";
import { motion } from "framer-motion";

interface ArticleCardProps {
  article: Article;
  index: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.article
      className="article-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group w-full hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut",
      }}
    >
      <div className="relative overflow-hidden h-48 w-full">
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={400}
          height={300}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute top-3 left-3 z-10">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {article.category}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {article.title}
        </h2>

        <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200">
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
    </motion.article>
  );
};
