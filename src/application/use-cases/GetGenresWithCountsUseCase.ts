import type { IComicsManifestRepository } from '../ports';
import type { Genre } from '../../domain/entities';

/**
 * Caso de uso: Obtener géneros con conteos
 */
export class GetGenresWithCountsUseCase {
  private manifestRepository: IComicsManifestRepository;

  constructor(manifestRepository: IComicsManifestRepository) {
    this.manifestRepository = manifestRepository;
  }

  async execute(): Promise<Genre[]> {
    return await this.manifestRepository.getGenresWithCounts();
  }
}
