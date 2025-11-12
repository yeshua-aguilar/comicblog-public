import type { IBlogRepository, IComicsManifestRepository } from '../ports';

/**
 * Caso de uso: Eliminar post
 */
export class DeletePostUseCase {
  private blogRepository: IBlogRepository;
  private manifestRepository: IComicsManifestRepository;

  constructor(
    blogRepository: IBlogRepository,
    manifestRepository: IComicsManifestRepository
  ) {
    this.blogRepository = blogRepository;
    this.manifestRepository = manifestRepository;
  }

  async execute(slug: string): Promise<boolean> {
    if (!slug || slug.trim().length === 0) {
      throw new Error('El slug es requerido');
    }

    const success = await this.blogRepository.deletePost(slug);

    if (success) {
      // Invalidar cache y actualizar manifiesto
      this.manifestRepository.invalidateComicsListCache();
      this.manifestRepository.invalidateGenresCache();
      await this.manifestRepository.updateManifest();
    }

    return success;
  }
}
