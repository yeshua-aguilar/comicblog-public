import type { IComicsManifestRepository } from '../ports';
import type { BlogPost } from '../../domain/entities';

/**
 * Caso de uso: Obtener lista de cómics
 */
export class GetComicsListUseCase {
  private manifestRepository: IComicsManifestRepository;

  constructor(manifestRepository: IComicsManifestRepository) {
    this.manifestRepository = manifestRepository;
  }

  async execute(): Promise<BlogPost[]> {
    return await this.manifestRepository.getComicsList();
  }
}
