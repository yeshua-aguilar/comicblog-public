import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseBlogRepository } from '../FirebaseBlogRepository';
import type { CreateBlogPostData } from '../../../../domain/entities';

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    getDocs: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    setDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    startAfter: vi.fn(),
}));

// Mock firebaseConfig
vi.mock('../firebaseConfig', () => ({
    db: {},
}));

import { getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

describe('FirebaseBlogRepository', () => {
    let repository: FirebaseBlogRepository;

    beforeEach(() => {
        repository = new FirebaseBlogRepository();
        vi.clearAllMocks();
    });

    it('should get all posts successfully', async () => {
        const mockDocs = [
            {
                id: 'post-1',
                data: () => ({
                    title: 'Post 1',
                    author: 'Author 1',
                    fecha: '2023-01-01',
                    tags: ['tag1'],
                    descripcion: 'Excerpt 1',
                    portada: 'image1.jpg',
                    contenido: 'Content 1',
                }),
            },
        ];

        (getDocs as any).mockResolvedValue({
            docs: mockDocs,
        });

        const result = await repository.getAllPosts();

        expect(result).toHaveLength(1);
        expect(result[0].slug).toBe('post-1');
        expect(result[0].title).toBe('Post 1');
        expect(getDocs).toHaveBeenCalled();
    });

    it('should get post by slug successfully', async () => {
        const mockDoc = {
            exists: () => true,
            id: 'post-1',
            data: () => ({
                title: 'Post 1',
                author: 'Author 1',
                fecha: '2023-01-01',
                tags: ['tag1'],
                descripcion: 'Excerpt 1',
                portada: 'image1.jpg',
                contenido: 'Content 1',
            }),
        };

        (getDoc as any).mockResolvedValue(mockDoc);

        const result = await repository.getPostBySlug('post-1');

        expect(result).not.toBeNull();
        expect(result?.slug).toBe('post-1');
        expect(result?.title).toBe('Post 1');
        expect(getDoc).toHaveBeenCalled();
    });

    it('should return null if post by slug does not exist', async () => {
        const mockDoc = {
            exists: () => false,
        };

        (getDoc as any).mockResolvedValue(mockDoc);

        const result = await repository.getPostBySlug('non-existent');

        expect(result).toBeNull();
    });

    it('should create post successfully', async () => {
        const postData: CreateBlogPostData = {
            title: 'New Post',
            author: 'New Author',
            date: '2023-01-02',
            tags: ['new'],
            excerpt: 'New Excerpt',
            image: 'new.jpg',
            content: 'New Content',
        };

        (addDoc as any).mockResolvedValue({ id: 'new-id' });

        const result = await repository.createPost(postData);

        expect(result).toBe('new-id');
        expect(addDoc).toHaveBeenCalled();
    });

    it('should update post successfully', async () => {
        (updateDoc as any).mockResolvedValue(undefined);

        const result = await repository.updatePost('post-1', { title: 'Updated Title' });

        expect(result).toBe(true);
        expect(updateDoc).toHaveBeenCalled();
    });

    it('should delete post successfully', async () => {
        (deleteDoc as any).mockResolvedValue(undefined);

        const result = await repository.deletePost('post-1');

        expect(result).toBe(true);
        expect(deleteDoc).toHaveBeenCalled();
    });
});
