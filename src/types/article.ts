export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
  readTime: number;
  tags: string[];
}

export interface ArticlesResponse {
  articles: Article[];
  hasMore: boolean;
  nextPage: number;
}

