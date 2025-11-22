import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreatePostUseCase } from '../CreatePostUseCase';
import type { IBlogRepository, IComicsManifestRepository } from '../../ports';
import type { CreateBlogPostData } from '../../../domain/entities';
import { eventBus } from '../../../domain/events';
import { ValidationError } from '../../../domain/errors';

// Mock eventBus
vi.mock('../../../domain/events', async () => {
    const actual = await vi.importActual('../../../domain/events');
    return {
        ...actual,
        eventBus: {
            publish: vi.fn(),
            subscribe: vi.fn(),
        },
    };
});

describe('CreatePostUseCase', () => {
    let useCase: CreatePostUseCase;
    let mockBlogRepository: IBlogRepository;
    let mockManifestRepository: IComicsManifestRepository;

    beforeEach(() => {
        mockBlogRepository = {
            createPost: vi.fn(),
            updatePost: vi.fn(),
            deletePost: vi.fn(),
            getPostBySlug: vi.fn(),
            getAllPosts: vi.fn(),
            getPostsPaginated: vi.fn(),
            getPostsByTag: vi.fn(),
            createPostWithSlug: vi.fn(),
            searchComics: vi.fn(),
            searchComicsByTag: vi.fn(),
            getSearchSuggestions: vi.fn(),
        };

        mockManifestRepository = {
            getComicsList: vi.fn(),
            getGenresWithCounts: vi.fn(),
            updateManifest: vi.fn(),
            invalidateComicsListCache: vi.fn(),
            invalidateGenresCache: vi.fn(),
        };

        useCase = new CreatePostUseCase(mockBlogRepository, mockManifestRepository);
        vi.clearAllMocks();
    });

    it('should create a post successfully', async () => {
        const postData: CreateBlogPostData = {
            title: 'Test Post',
            content: 'Test Content',
            author: 'Test Author',
            tags: ['test'],
            image: 'http://test.com/image.jpg',
            date: '2023-01-01',
            excerpt: 'Test Excerpt',
        };

        const mockPostId = 'new-post-id';
        (mockBlogRepository.createPost as any).mockResolvedValue(mockPostId);

        const result = await useCase.execute(postData);

        expect(result).toBe(mockPostId);
        expect(mockBlogRepository.createPost).toHaveBeenCalledWith(postData);
        expect(mockManifestRepository.invalidateComicsListCache).toHaveBeenCalled();
        expect(mockManifestRepository.invalidateGenresCache).toHaveBeenCalled();
        expect(mockManifestRepository.updateManifest).toHaveBeenCalled();
        expect(eventBus.publish).toHaveBeenCalled();
    });

    it('should throw ValidationError if data is invalid', async () => {
        const invalidPostData: CreateBlogPostData = {
            title: '', // Invalid title
            content: 'Test Content',
            author: 'Test Author',
            tags: ['test'],
            image: 'http://test.com/image.jpg',
            date: '2023-01-01',
            excerpt: 'Test Excerpt',
        };

        await expect(useCase.execute(invalidPostData)).rejects.toThrow(ValidationError);
        expect(mockBlogRepository.createPost).not.toHaveBeenCalled();
    });

    it('should throw Error if repository fails', async () => {
        const postData: CreateBlogPostData = {
            title: 'Test Post',
            content: 'Test Content',
            author: 'Test Author',
            tags: ['test'],
            image: 'http://test.com/image.jpg',
            date: '2023-01-01',
            excerpt: 'Test Excerpt',
        };

        (mockBlogRepository.createPost as any).mockRejectedValue(new Error('DB Error'));

        await expect(useCase.execute(postData)).rejects.toThrow('Error al crear el post: Error: DB Error');
    });
});
