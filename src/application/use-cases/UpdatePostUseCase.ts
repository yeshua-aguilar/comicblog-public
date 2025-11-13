import type { IBlogRepository, IComicsManifestRepository } from '../ports';
import type { UpdateBlogPostData } from '../../domain/entities';
import { eventBus, PostUpdatedEvent } from '../../domain/events';
import { ValidationError } from '../../domain/errors';
import { Slug } from '../../domain/value-objects';

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
    try {
      // Validar slug
      Slug.create(slug);

      const success = await this.blogRepository.updatePost(slug, postData);

      if (success) {
        // Invalidar cache y actualizar manifiesto
        this.manifestRepository.invalidateComicsListCache();
        if (postData.tags !== undefined) {
          this.manifestRepository.invalidateGenresCache();
        }
        await this.manifestRepository.updateManifest();

        // Emitir evento de dominio
        await eventBus.publish(new PostUpdatedEvent(slug, postData));
      }

      return success;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Error al actualizar el post: ${error}`);
    }
  }
}
