import matter from 'gray-matter';
import type { BlogPost, BlogPostMetadata } from '../types/blog';

// Lista de archivos markdown disponibles
const markdownFiles = {
  'post-1': '/data/posts/post-1.md',
  'post-2': '/data/posts/post-2.md',
  'post-3': '/data/posts/post-3.md',
};

// Cache para los contenidos cargados
const contentCache: Record<string, string> = {};

// Función para cargar contenido markdown
const loadMarkdownContent = async (filePath: string): Promise<string> => {
  if (contentCache[filePath]) {
    return contentCache[filePath];
  }
  
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}`);
    }
    const content = await response.text();
    contentCache[filePath] = content;
    return content;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return '';
  }
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
  console.log('getAllPosts called');
  const posts: BlogPost[] = [];
  
  for (const [slug, filePath] of Object.entries(markdownFiles)) {
    console.log(`Loading ${slug} from ${filePath}`);
    const content = await loadMarkdownContent(filePath);
    
    if (content) {
      const { data, content: markdownContent } = matter(content);
      const metadata = data as BlogPostMetadata;
      
      posts.push({
        slug,
        ...metadata,
        content: markdownContent
      });
    }
  }
  
  // Ordenar posts por fecha (más reciente primero)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  console.log(`Total posts loaded: ${posts.length}`);
  return posts
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const filePath = markdownFiles[slug as keyof typeof markdownFiles];
  if (!filePath) return null;
  
  const content = await loadMarkdownContent(filePath);
  if (!content) return null;
  
  const { data, content: markdownContent } = matter(content);
  const metadata = data as BlogPostMetadata;
  
  return {
    slug,
    ...metadata,
    content: markdownContent
  };
};

export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
};