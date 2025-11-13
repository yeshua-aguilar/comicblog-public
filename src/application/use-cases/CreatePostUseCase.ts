import type { IBlogRepository, IComicsManifestRepository } from '../ports';
import type { CreateBlogPostData } from '../../domain/entities';
import { BlogPostEntity } from '../../domain/entities';
import { eventBus, PostCreatedEvent } from '../../domain/events';
import { ValidationError } from '../../domain/errors';

/**
 * Caso de uso: Crear nuevo post
 */
export class CreatePostUseCase {
  private blogRepository: IBlogRepository;
  private manifestRepository: IComicsManifestRepository;

  constructor(
    blogRepository: IBlogRepository,
    manifestRepository: IComicsManifestRepository
  ) {
    this.blogRepository = blogRepository;
    this.manifestRepository = manifestRepository;
  }

  async execute(postData: CreateBlogPostData): Promise<string | null> {
    try {
      // Validar con la entidad de dominio
      // Crear un slug temporal para validar
      const tempSlug = postData.title.toLowerCase().replace(/\s+/g, '-');
      BlogPostEntity.create({
        slug: tempSlug,
        ...postData,
      });

      // Crear el post en el repositorio
      const postId = await this.blogRepository.createPost(postData);

      if (postId) {
        // Invalidar cache y actualizar manifiesto
        this.manifestRepository.invalidateComicsListCache();
        this.manifestRepository.invalidateGenresCache();
        await this.manifestRepository.updateManifest();

        // Emitir evento de dominio
        await eventBus.publish(
          new PostCreatedEvent(postId, postData.title, postData.author, postData.tags)
        );
      }

      return postId;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Error al crear el post: ${error}`);
    }
  }
}
