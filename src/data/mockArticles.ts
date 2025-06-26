import { Article } from '@/types/article';

const categories = ['Technology', 'Design', 'Business', 'Science', 'Travel', 'Food', 'Health', 'Art'];
const authors = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sarah Wilson', 'Mike Brown', 'Emily Davis'];

const sampleImages = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
];

const shortExcerpts = [
  'A brief introduction to modern web development practices.',
  'Quick tips for better design.',
  'Essential business strategies.',
  'Latest scientific discoveries.',
];

const mediumExcerpts = [
  'Exploring the latest trends in technology and how they impact our daily lives. From artificial intelligence to blockchain, these innovations are reshaping industries.',
  'Design principles that create meaningful user experiences. Understanding color theory, typography, and layout fundamentals for better visual communication.',
  'Building sustainable business models in the digital age. Strategies for growth, customer retention, and market expansion in competitive environments.',
  'Scientific breakthroughs that are changing our understanding of the world. From quantum computing to genetic engineering, research continues to push boundaries.',
];

const longExcerpts = [
  'In-depth analysis of emerging technologies and their potential impact on society. This comprehensive guide covers everything from machine learning algorithms to sustainable energy solutions. We explore how these innovations are not only changing industries but also creating new opportunities for entrepreneurs and established businesses alike. The digital transformation has accelerated rapidly, and understanding these trends is crucial for staying competitive in today\'s market.',
  'A complete guide to modern design thinking and user experience principles. This article delves into the psychology of design, exploring how colors, shapes, and layouts influence user behavior. We examine case studies from successful companies and provide practical tips for implementing design systems that scale. Whether you\'re a beginner or experienced designer, these insights will help you create more effective and engaging digital experiences.',
  'Strategic business planning for the next decade. As markets evolve and consumer preferences shift, companies must adapt their strategies to remain relevant. This comprehensive analysis covers market research, competitive analysis, and strategic planning methodologies. We also explore the role of technology in business transformation and provide frameworks for decision-making in uncertain environments.',
];

const generateRandomContent = (length: 'short' | 'medium' | 'long'): string => {
  const paragraphs = {
    short: 2,
    medium: 4,
    long: 8,
  };

  const sentences = [
    'Technology continues to evolve at an unprecedented pace.',
    'Innovation drives progress in every industry.',
    'Understanding user needs is crucial for success.',
    'Data-driven decisions lead to better outcomes.',
    'Collaboration enhances creativity and productivity.',
    'Sustainable practices are becoming increasingly important.',
    'Digital transformation affects all aspects of business.',
    'Continuous learning is essential in today\'s world.',
  ];

  let content = '';
  for (let i = 0; i < paragraphs[length]; i++) {
    const paragraph = [];
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    for (let j = 0; j < sentenceCount; j++) {
      paragraph.push(sentences[Math.floor(Math.random() * sentences.length)]);
    }
    content += paragraph.join(' ') + '\n\n';
  }
  return content.trim();
};

const generateMockArticles = (count: number, startId: number = 1): Article[] => {
  const articles: Article[] = [];

  for (let i = 0; i < count; i++) {
    const id = (startId + i).toString();
    const category = categories[Math.floor(Math.random() * categories.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const imageUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    
    // Vary content length for masonry effect
    const contentLength = Math.random() < 0.3 ? 'short' : Math.random() < 0.7 ? 'medium' : 'long';
    const excerptArray = contentLength === 'short' ? shortExcerpts : 
                        contentLength === 'medium' ? mediumExcerpts : longExcerpts;
    
    const excerpt = excerptArray[Math.floor(Math.random() * excerptArray.length)];
    const content = generateRandomContent(contentLength);
    
    const titles = [
      'The Future of Web Development',
      'Design Trends for 2024',
      'Building Scalable Applications',
      'Understanding User Experience',
      'Modern JavaScript Frameworks',
      'CSS Grid vs Flexbox',
      'API Design Best Practices',
      'Mobile-First Development',
      'Performance Optimization Tips',
      'Accessibility in Web Design',
      'State Management Solutions',
      'Testing Strategies',
      'DevOps for Frontend',
      'Progressive Web Apps',
      'Micro-Frontend Architecture',
    ];

    const tags = ['react', 'javascript', 'css', 'design', 'ux', 'frontend', 'backend', 'api', 'mobile', 'performance'];
    const articleTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);

    articles.push({
      id,
      title: titles[Math.floor(Math.random() * titles.length)],
      excerpt,
      content,
      author,
      publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl,
      category,
      readTime: Math.floor(Math.random() * 10) + 2,
      tags: articleTags,
    });
  }

  return articles;
};

export const mockArticles = generateMockArticles(50);

export const getArticles = (page: number = 1, limit: number = 12) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const articles = mockArticles.slice(startIndex, endIndex);
  
  return {
    articles,
    hasMore: endIndex < mockArticles.length,
    nextPage: page + 1,
  };
};

