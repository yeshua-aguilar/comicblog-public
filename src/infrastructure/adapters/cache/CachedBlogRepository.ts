import type { IBlogRepository, ICacheRepository } from '../../../application/ports';
import type { BlogPost, CreateBlogPostData, UpdateBlogPostData } from '../../../domain/entities';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

/**
 * Configuración del repositorio con caché
 */
export interface CachedRepositoryConfig {
  postTTL?: number; // TTL para posts individuales (ms)
  listTTL?: number; // TTL para listas de posts (ms)
  searchTTL?: number; // TTL para resultados de búsqueda (ms)
}

/**
 * Decorator que añade caché a cualquier repositorio de blogs
 * Implementa el patrón Decorator siguiendo la arquitectura hexagonal
 */
export class CachedBlogRepository implements IBlogRepository {
  private repository: IBlogRepository;
  private cache: ICacheRepository<BlogPost | BlogPost[] | { posts: BlogPost[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean } | string[]>;
  private config: Required<CachedRepositoryConfig>;

  constructor(
    repository: IBlogRepository,
    cache: ICacheRepository<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    config: CachedRepositoryConfig = {}
  ) {
    this.repository = repository;
    this.cache = cache;
    this.config = {
      postTTL: config.postTTL ?? 10 * 60 * 1000, // 10 minutos
      listTTL: config.listTTL ?? 5 * 60 * 1000,  // 5 minutos
      searchTTL: config.searchTTL ?? 3 * 60 * 1000, // 3 minutos
    };
  }

  /**
   * Genera clave de caché para un post específico
   */
  private getPostCacheKey(slug: string): string {
    return `post:${slug}`;
  }

  /**
   * Genera clave de caché para posts paginados
   */
  private getPostsPaginatedCacheKey(pageSize: number, lastDocId?: string): string {
    return `posts:paginated:${pageSize}:${lastDocId || 'first'}`;
  }

  /**
   * Genera clave de caché para todos los posts
   */
  private getAllPostsCacheKey(): string {
    return 'posts:all';
  }

  /**
   * Genera clave de caché para posts por tag
   */
  private getPostsByTagCacheKey(tag: string): string {
    return `posts:tag:${tag}`;
  }

  /**
   * Genera clave de caché para búsqueda
   */
  private getSearchCacheKey(searchTerm: string, maxResults?: number): string {
    return `search:${searchTerm}:${maxResults || 'all'}`;
  }

  /**
   * Genera clave de caché para búsqueda por tag
   */
  private getSearchByTagCacheKey(tag: string): string {
    return `search:tag:${tag}`;
  }

  /**
   * Genera clave de caché para sugerencias
   */
  private getSuggestionsCacheKey(partialTerm: string, maxSuggestions?: number): string {
    return `suggestions:${partialTerm}:${maxSuggestions || 5}`;
  }

  async getPostsPaginated(
    pageSize: number,
    lastDoc?: QueryDocumentSnapshot
  ): Promise<{ posts: BlogPost[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> {
    const cacheKey = this.getPostsPaginatedCacheKey(pageSize, lastDoc?.id);
    
    // Intentar obtener del caché
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as { posts: BlogPost[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean };
    }

    // Si no está en caché, obtener del repositorio
    const result = await this.repository.getPostsPaginated(pageSize, lastDoc);
    
    // Guardar en caché
    await this.cache.set(cacheKey, result, this.config.listTTL);

    return result;
  }

  async getAllPosts(): Promise<BlogPost[]> {
    const cacheKey = this.getAllPostsCacheKey();
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as BlogPost[];
    }

    const posts = await this.repository.getAllPosts();
    await this.cache.set(cacheKey, posts, this.config.listTTL);

    return posts;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const cacheKey = this.getPostCacheKey(slug);
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as BlogPost;
    }

    const post = await this.repository.getPostBySlug(slug);
    if (post) {
      await this.cache.set(cacheKey, post, this.config.postTTL);
    }

    return post;
  }

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    const cacheKey = this.getPostsByTagCacheKey(tag);
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as BlogPost[];
    }

    const posts = await this.repository.getPostsByTag(tag);
    await this.cache.set(cacheKey, posts, this.config.listTTL);

    return posts;
  }

  async createPost(postData: CreateBlogPostData): Promise<string | null> {
    const postId = await this.repository.createPost(postData);
    
    if (postId) {
      // Invalidar cachés relacionados
      await this.invalidateListCaches();
    }

    return postId;
  }

  async createPostWithSlug(slug: string, postData: CreateBlogPostData): Promise<boolean> {
    const success = await this.repository.createPostWithSlug(slug, postData);
    
    if (success) {
      // Invalidar cachés relacionados
      await this.invalidateListCaches();
    }

    return success;
  }

  async updatePost(slug: string, postData: UpdateBlogPostData): Promise<boolean> {
    const success = await this.repository.updatePost(slug, postData);
    
    if (success) {
      // Invalidar el post específico y las listas
      await this.cache.delete(this.getPostCacheKey(slug));
      await this.invalidateListCaches();
    }

    return success;
  }

  async deletePost(slug: string): Promise<boolean> {
    const success = await this.repository.deletePost(slug);
    
    if (success) {
      // Invalidar el post específico y las listas
      await this.cache.delete(this.getPostCacheKey(slug));
      await this.invalidateListCaches();
    }

    return success;
  }

  async searchComics(searchTerm: string, maxResults?: number): Promise<BlogPost[]> {
    const cacheKey = this.getSearchCacheKey(searchTerm, maxResults);
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as BlogPost[];
    }

    const posts = await this.repository.searchComics(searchTerm, maxResults);
    await this.cache.set(cacheKey, posts, this.config.searchTTL);

    return posts;
  }

  async searchComicsByTag(tag: string): Promise<BlogPost[]> {
    const cacheKey = this.getSearchByTagCacheKey(tag);
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as BlogPost[];
    }

    const posts = await this.repository.searchComicsByTag(tag);
    await this.cache.set(cacheKey, posts, this.config.searchTTL);

    return posts;
  }

  async getSearchSuggestions(partialTerm: string, maxSuggestions?: number): Promise<string[]> {
    const cacheKey = this.getSuggestionsCacheKey(partialTerm, maxSuggestions);
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached as string[];
    }

    const suggestions = await this.repository.getSearchSuggestions(partialTerm, maxSuggestions);
    await this.cache.set(cacheKey, suggestions, this.config.searchTTL);

    return suggestions;
  }

  /**
   * Invalida todos los cachés de listas
   */
  private async invalidateListCaches(): Promise<void> {
    await this.cache.deletePattern('posts:*');
    await this.cache.deletePattern('search:*');
    await this.cache.deletePattern('suggestions:*');
  }

  /**
   * Invalida todo el caché
   */
  public async invalidateAllCache(): Promise<void> {
    await this.cache.clear();
  }
}
