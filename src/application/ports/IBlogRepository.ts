import type { BlogPost, CreateBlogPostData, UpdateBlogPostData } from '../../domain/entities';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

/**
 * Puerto (Interface) para el repositorio de blogs
 * Define las operaciones disponibles sin depender de la implementación
 */
export interface IBlogRepository {
  /**
   * Obtiene posts de forma paginada
   */
  getPostsPaginated(
    pageSize: number,
    lastDoc?: QueryDocumentSnapshot
  ): Promise<{ posts: BlogPost[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }>;

  /**
   * Obtiene todos los posts
   */
  getAllPosts(): Promise<BlogPost[]>;

  /**
   * Obtiene un post por su slug
   */
  getPostBySlug(slug: string): Promise<BlogPost | null>;

  /**
   * Obtiene posts por tag
   */
  getPostsByTag(tag: string): Promise<BlogPost[]>;

  /**
   * Crea un nuevo post
   */
  createPost(postData: CreateBlogPostData): Promise<string | null>;

  /**
   * Crea un nuevo post con slug personalizado
   */
  createPostWithSlug(slug: string, postData: CreateBlogPostData): Promise<boolean>;

  /**
   * Actualiza un post existente
   */
  updatePost(slug: string, postData: UpdateBlogPostData): Promise<boolean>;

  /**
   * Elimina un post
   */
  deletePost(slug: string): Promise<boolean>;

  /**
   * Busca comics por término de búsqueda
   */
  searchComics(searchTerm: string, maxResults?: number): Promise<BlogPost[]>;

  /**
   * Busca comics por tag específico
   */
  searchComicsByTag(tag: string): Promise<BlogPost[]>;

  /**
   * Obtiene sugerencias de búsqueda
   */
  getSearchSuggestions(partialTerm: string, maxSuggestions?: number): Promise<string[]>;
}
