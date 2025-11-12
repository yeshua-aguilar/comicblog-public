import type { IBlogRepository, IComicsManifestRepository } from '../ports';
import type { CreateBlogPostData } from '../../domain/entities';

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
    // Validaciones de negocio
    if (!postData.title || postData.title.trim().length === 0) {
      throw new Error('El título es requerido');
    }

    if (!postData.author || postData.author.trim().length === 0) {
      throw new Error('El autor es requerido');
    }

    const postId = await this.blogRepository.createPost(postData);

    if (postId) {
      // Invalidar cache y actualizar manifiesto
      this.manifestRepository.invalidateComicsListCache();
      this.manifestRepository.invalidateGenresCache();
      await this.manifestRepository.updateManifest();
    }

    return postId;
  }
}
