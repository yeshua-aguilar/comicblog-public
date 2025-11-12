import type { IBlogRepository } from '../ports';
import type { BlogPost } from '../../domain/entities';

/**
 * Caso de uso: Obtener post por slug
 */
export class GetPostBySlugUseCase {
  private blogRepository: IBlogRepository;

  constructor(blogRepository: IBlogRepository) {
    this.blogRepository = blogRepository;
  }

  async execute(slug: string): Promise<BlogPost | null> {
    if (!slug || slug.trim().length === 0) {
      throw new Error('El slug es requerido');
    }

    return await this.blogRepository.getPostBySlug(slug);
  }
}
