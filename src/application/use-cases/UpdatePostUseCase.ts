import type { IBlogRepository, IComicsManifestRepository } from '../ports';
import type { UpdateBlogPostData } from '../../domain/entities';

/**
 * Caso de uso: Actualizar post existente
 */
export class UpdatePostUseCase {
  private blogRepository: IBlogRepository;
  private manifestRepository: IComicsManifestRepository;

  constructor(
    blogRepository: IBlogRepository,
    manifestRepository: IComicsManifestRepository
  ) {
    this.blogRepository = blogRepository;
    this.manifestRepository = manifestRepository;
  }

  async execute(slug: string, postData: UpdateBlogPostData): Promise<boolean> {
    if (!slug || slug.trim().length === 0) {
      throw new Error('El slug es requerido');
    }

    const success = await this.blogRepository.updatePost(slug, postData);

    if (success) {
      // Invalidar cache y actualizar manifiesto
      this.manifestRepository.invalidateComicsListCache();
      if (postData.tags !== undefined) {
        this.manifestRepository.invalidateGenresCache();
      }
      await this.manifestRepository.updateManifest();
    }

    return success;
  }
}
