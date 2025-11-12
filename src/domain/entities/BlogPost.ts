/**
 * Entidad de dominio: BlogPost
 * Representa una publicación de blog/cómic en el sistema
 */
export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  image?: string;
  comicPages?: string;
}

/**
 * Tipo de datos para BlogPost (para interoperabilidad)
 */
export type BlogPostData = BlogPost;

/**
 * Tipo para crear un nuevo post (sin slug)
 */
export type CreateBlogPostData = Omit<BlogPost, 'slug'>;

/**
 * Tipo para actualizar un post (campos opcionales excepto slug)
 */
export type UpdateBlogPostData = Partial<Omit<BlogPost, 'slug'>>;

