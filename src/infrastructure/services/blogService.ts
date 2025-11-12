import { FirebaseBlogRepository, FirebaseComicsManifestRepository } from '../adapters/firebase';
import {
  GetComicsListUseCase,
  GetPostBySlugUseCase,
  GetGenresWithCountsUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  CreatePostWithSlugUseCase
} from '../../application/use-cases';
import type { BlogPost, Genre, CreateBlogPostData, UpdateBlogPostData } from '../../domain/entities';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

/**
 * Servicio Facade que expone las operaciones de blog usando arquitectura hexagonal
 * Mantiene una API compatible con el servicio anterior para facilitar la migración
 */
class BlogService {
  private blogRepository: FirebaseBlogRepository;
  private manifestRepository: FirebaseComicsManifestRepository;

  // Casos de uso
  private getComicsListUseCase: GetComicsListUseCase;
  private getPostBySlugUseCase: GetPostBySlugUseCase;
  private getGenresWithCountsUseCase: GetGenresWithCountsUseCase;
  private createPostUseCase: CreatePostUseCase;
  private updatePostUseCase: UpdatePostUseCase;
  private deletePostUseCase: DeletePostUseCase;
  private createPostWithSlugUseCase: CreatePostWithSlugUseCase;

  constructor() {
    // Inicializar repositorios
    this.blogRepository = new FirebaseBlogRepository();
    this.manifestRepository = new FirebaseComicsManifestRepository(this.blogRepository);

    // Inicializar casos de uso
    this.getComicsListUseCase = new GetComicsListUseCase(this.manifestRepository);
    this.getPostBySlugUseCase = new GetPostBySlugUseCase(this.blogRepository);
    this.getGenresWithCountsUseCase = new GetGenresWithCountsUseCase(this.manifestRepository);
    this.createPostUseCase = new CreatePostUseCase(this.blogRepository, this.manifestRepository);
    this.updatePostUseCase = new UpdatePostUseCase(this.blogRepository, this.manifestRepository);
    this.deletePostUseCase = new DeletePostUseCase(this.blogRepository, this.manifestRepository);
    this.createPostWithSlugUseCase = new CreatePostWithSlugUseCase(this.blogRepository, this.manifestRepository);
  }

  /**
   * Obtiene posts de forma paginada desde Firestore
   */
  async getPostsPaginated(
    pageSize: number = 9,
    lastDoc?: QueryDocumentSnapshot
  ): Promise<{ posts: BlogPost[]; lastDoc: QueryDocumentSnapshot | null; hasMore: boolean }> {
    return await this.blogRepository.getPostsPaginated(pageSize, lastDoc);
  }

  /**
   * Obtiene la lista de cómics desde el documento manifiesto
   */
  async getComicsList(): Promise<BlogPost[]> {
    return await this.getComicsListUseCase.execute();
  }

  /**
   * Invalida el cache de la lista de cómics
   */
  invalidateComicsListCache(): void {
    this.manifestRepository.invalidateComicsListCache();
  }

  /**
   * Obtiene géneros con conteo desde el manifiesto de cómics
   */
  async getGenresWithCounts(): Promise<Genre[]> {
    return await this.getGenresWithCountsUseCase.execute();
  }

  /**
   * Invalida el cache de géneros
   */
  invalidateGenresCache(): void {
    this.manifestRepository.invalidateGenresCache();
  }

  /**
   * Obtiene todos los posts desde Firestore (uso limitado por costo)
   */
  async getAllPosts(): Promise<BlogPost[]> {
    return await this.blogRepository.getAllPosts();
  }

  /**
   * Obtiene un post por su slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return await this.getPostBySlugUseCase.execute(slug);
  }

  /**
   * Obtiene posts por tag
   */
  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    return await this.blogRepository.getPostsByTag(tag);
  }

  /**
   * Busca comics de manera eficiente usando múltiples criterios
   */
  async searchComics(searchTerm: string, maxResults: number = 20): Promise<BlogPost[]> {
    return await this.manifestRepository.searchComics(searchTerm, maxResults);
  }

  /**
   * Busca comics por tag específico de manera optimizada
   */
  async searchComicsByTag(tag: string): Promise<BlogPost[]> {
    return await this.manifestRepository.searchComicsByTag(tag);
  }

  /**
   * Obtiene sugerencias de búsqueda basadas en títulos y tags existentes
   */
  async getSearchSuggestions(partialTerm: string, maxSuggestions: number = 5): Promise<string[]> {
    return await this.manifestRepository.getSearchSuggestions(partialTerm, maxSuggestions);
  }

  /**
   * Crea un nuevo post en Firestore
   */
  async createPost(postData: CreateBlogPostData): Promise<string | null> {
    return await this.createPostUseCase.execute(postData);
  }

  /**
   * Actualiza un post existente en Firestore
   */
  async updatePost(slug: string, postData: UpdateBlogPostData): Promise<boolean> {
    return await this.updatePostUseCase.execute(slug, postData);
  }

  /**
   * Elimina un post de Firestore
   */
  async deletePost(slug: string): Promise<boolean> {
    return await this.deletePostUseCase.execute(slug);
  }

  /**
   * Crea un nuevo post con un slug personalizado
   */
  async createPostWithSlug(slug: string, postData: CreateBlogPostData): Promise<boolean> {
    return await this.createPostWithSlugUseCase.execute(slug, postData);
  }
}

// Exportar instancia singleton del servicio
const blogService = new BlogService();

// Exportar funciones individuales para mantener compatibilidad con la API anterior
export const getPostsPaginated = blogService.getPostsPaginated.bind(blogService);
export const getComicsList = blogService.getComicsList.bind(blogService);
export const invalidateComicsListCache = blogService.invalidateComicsListCache.bind(blogService);
export const getGenresWithCounts = blogService.getGenresWithCounts.bind(blogService);
export const invalidateGenresCache = blogService.invalidateGenresCache.bind(blogService);
export const getAllPosts = blogService.getAllPosts.bind(blogService);
export const getPostBySlug = blogService.getPostBySlug.bind(blogService);
export const getPostsByTag = blogService.getPostsByTag.bind(blogService);
export const searchComics = blogService.searchComics.bind(blogService);
export const searchComicsByTag = blogService.searchComicsByTag.bind(blogService);
export const getSearchSuggestions = blogService.getSearchSuggestions.bind(blogService);
export const createPost = blogService.createPost.bind(blogService);
export const updatePost = blogService.updatePost.bind(blogService);
export const deletePost = blogService.deletePost.bind(blogService);
export const createPostWithSlug = blogService.createPostWithSlug.bind(blogService);

export default blogService;
