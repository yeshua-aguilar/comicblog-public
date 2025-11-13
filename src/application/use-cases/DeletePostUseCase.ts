import type { IBlogRepository, IComicsManifestRepository } from '../ports';
import { eventBus, PostDeletedEvent } from '../../domain/events';
import { ValidationError } from '../../domain/errors';
import { Slug } from '../../domain/value-objects';

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
    try {
      // Validar slug
      Slug.create(slug);

      // Obtener el post antes de eliminarlo para el evento
      const post = await this.blogRepository.getPostBySlug(slug);
      if (!post) {
        throw new ValidationError(`Post con slug "${slug}" no encontrado`);
      }

      const success = await this.blogRepository.deletePost(slug);

      if (success) {
        // Invalidar cache y actualizar manifiesto
        this.manifestRepository.invalidateComicsListCache();
        this.manifestRepository.invalidateGenresCache();
        await this.manifestRepository.updateManifest();

        // Emitir evento de dominio
        await eventBus.publish(new PostDeletedEvent(slug, post.title));
      }

      return success;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Error al eliminar el post: ${error}`);
    }
  }
}
