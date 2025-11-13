import type { IBlogRepository } from '../ports';
import type { BlogPost } from '../../domain/entities';
import { eventBus, PostSearchedEvent } from '../../domain/events';

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

    const results = await this.blogRepository.searchComics(searchTerm.trim(), maxResults);

    // Emitir evento de búsqueda
    await eventBus.publish(new PostSearchedEvent(searchTerm.trim(), results.length));

    return results;
  }
}
