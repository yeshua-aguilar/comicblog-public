import type { IBlogRepository, IComicsManifestRepository } from '../ports';
import type { CreateBlogPostData } from '../../domain/entities';

/**
 * Caso de uso: Crear post con slug personalizado
 */
export class CreatePostWithSlugUseCase {
  private blogRepository: IBlogRepository;
  private manifestRepository: IComicsManifestRepository;

  constructor(
    blogRepository: IBlogRepository,
    manifestRepository: IComicsManifestRepository
  ) {
    this.blogRepository = blogRepository;
    this.manifestRepository = manifestRepository;
  }

  async execute(slug: string, postData: CreateBlogPostData): Promise<boolean> {
    // Validaciones de negocio
    if (!slug || slug.trim().length === 0) {
      throw new Error('El slug es requerido');
    }

    if (!postData.title || postData.title.trim().length === 0) {
      throw new Error('El título es requerido');
    }

    if (!postData.author || postData.author.trim().length === 0) {
      throw new Error('El autor es requerido');
    }

    const success = await this.blogRepository.createPostWithSlug(slug, postData);

    if (success) {
      // Invalidar cache y actualizar manifiesto
      this.manifestRepository.invalidateComicsListCache();
      this.manifestRepository.invalidateGenresCache();
      await this.manifestRepository.updateManifest();
    }

    return success;
  }
}
