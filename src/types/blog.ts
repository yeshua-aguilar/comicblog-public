export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  image?: string;
}

export interface BlogPostMetadata {
  title: string;
  author: string;
  date: string;
  tags: string[];
  excerpt: string;
  image?: string;
}
