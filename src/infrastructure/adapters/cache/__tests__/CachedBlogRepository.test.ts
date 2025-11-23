import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CachedBlogRepository } from '../CachedBlogRepository';
import type { IBlogRepository, ICacheRepository } from '../../../../application/ports';
import type { BlogPost } from '../../../../domain/entities';

// Mock simple cache implementation for testing
class MockCacheAdapter implements ICacheRepository<any> {
    private cache = new Map<string, any>();

    async get(key: string): Promise<any | null> {
        return this.cache.get(key) || null;
    }

    async set(key: string, value: any): Promise<void> {
        this.cache.set(key, value);
    }

    async delete(key: string): Promise<void> {
        this.cache.delete(key);
    }

    async deletePattern(pattern: string): Promise<void> {
        // Simple mock implementation
        if (pattern.includes('*')) {
            this.cache.clear();
        }
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }

    async has(key: string): Promise<boolean> {
        return this.cache.has(key);
    }
}

describe('CachedBlogRepository', () => {
    let cachedRepository: CachedBlogRepository;
    let mockRepository: IBlogRepository;
    let cacheAdapter: MockCacheAdapter;

    beforeEach(() => {
        mockRepository = {
            getPostBySlug: vi.fn(),
            getAllPosts: vi.fn(),
            getPostsPaginated: vi.fn(),
            getPostsByTag: vi.fn(),
            createPost: vi.fn(),
            createPostWithSlug: vi.fn(),
            updatePost: vi.fn(),
            deletePost: vi.fn(),
            searchComics: vi.fn(),
            searchComicsByTag: vi.fn(),
            getSearchSuggestions: vi.fn(),
        };

        cacheAdapter = new MockCacheAdapter();
        cachedRepository = new CachedBlogRepository(mockRepository, cacheAdapter);
    });

    it('should return cached post if available', async () => {
        const slug = 'test-post';
        const mockPost: BlogPost = {
            title: 'Test Post',
            slug: slug,
            author: 'Test Author',
            date: '2023-01-01',
            tags: ['test'],
            excerpt: 'Excerpt',
            content: 'Content',
        };

        // Set cache manually
        await cacheAdapter.set(`post:${slug}`, mockPost);

        const result = await cachedRepository.getPostBySlug(slug);

        expect(result).toEqual(mockPost);
        expect(mockRepository.getPostBySlug).not.toHaveBeenCalled();
    });

    it('should fetch from repository and cache if not in cache', async () => {
        const slug = 'test-post';
        const mockPost: BlogPost = {
            title: 'Test Post',
            slug: slug,
            author: 'Test Author',
            date: '2023-01-01',
            tags: ['test'],
            excerpt: 'Excerpt',
            content: 'Content',
        };

        (mockRepository.getPostBySlug as any).mockResolvedValue(mockPost);

        const result = await cachedRepository.getPostBySlug(slug);

        expect(result).toEqual(mockPost);
        expect(mockRepository.getPostBySlug).toHaveBeenCalledWith(slug);

        // Verify it's now in cache
        const cached = await cacheAdapter.get(`post:${slug}`);
        expect(cached).toEqual(mockPost);
    });
});
