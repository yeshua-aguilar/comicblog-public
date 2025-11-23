import { describe, it, expect, vi } from 'vitest';
import { GetComicsListUseCase } from '../GetComicsListUseCase';
import type { IComicsManifestRepository } from '../../ports';
import type { BlogPost } from '../../../domain/entities';

describe('GetComicsListUseCase', () => {
    it('should return a list of comics', async () => {
        const mockComics: BlogPost[] = [
            {
                title: 'Comic 1',
                slug: 'comic-1',
                author: 'Author 1',
                date: '2023-01-01',
                tags: ['tag1'],
                excerpt: 'Excerpt 1',
                content: 'Content 1',
            },
        ];

        const mockManifestRepository: IComicsManifestRepository = {
            getComicsList: vi.fn().mockResolvedValue(mockComics),
            getGenresWithCounts: vi.fn(),
            updateManifest: vi.fn(),
            invalidateComicsListCache: vi.fn(),
            invalidateGenresCache: vi.fn(),
        };

        const useCase = new GetComicsListUseCase(mockManifestRepository);
        const result = await useCase.execute();

        expect(result).toEqual(mockComics);
        expect(mockManifestRepository.getComicsList).toHaveBeenCalledTimes(1);
    });
});
