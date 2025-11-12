import type { IBlogRepository } from '../ports';
import type { BlogPost } from '../../domain/entities';

/**
 * Caso de uso: Buscar cómics
 */
export class SearchComicsUseCase {
  private blogRepository: IBlogRepository;

  constructor(blogRepository: IBlogRepository) {
    this.blogRepository = blogRepository;
  }

  async execute(searchTerm: string, maxResults: number = 20): Promise<BlogPost[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    return await this.blogRepository.searchComics(searchTerm.trim(), maxResults);
  }
}
