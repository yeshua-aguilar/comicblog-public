import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IndexedDBCacheAdapter } from '../IndexedDBCacheAdapter';
import 'fake-indexeddb/auto';

describe('IndexedDBCacheAdapter', () => {
    let cache: IndexedDBCacheAdapter<string>;

    beforeEach(() => {
        cache = new IndexedDBCacheAdapter({
            dbName: 'test-db-' + Math.random(),
            defaultTTL: 1000,
            cleanupInterval: 500,
        });
    });

    afterEach(() => {
        cache.stopCleanupTimer();
    });

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    it('should set and get value', async () => {
        await cache.set('key1', 'value1');
        const value = await cache.get('key1');
        expect(value).toBe('value1');
    });

    it('should return null for non-existent key', async () => {
        const value = await cache.get('non-existent');
        expect(value).toBeNull();
    });

    it('should expire value after TTL', async () => {
        await cache.set('key1', 'value1', 1000);

        // Wait for TTL to expire
        await sleep(1100);

        const value = await cache.get('key1');
        expect(value).toBeNull();
    });

    it('should delete value', async () => {
        await cache.set('key1', 'value1');
        await cache.delete('key1');
        const value = await cache.get('key1');
        expect(value).toBeNull();
    });

    it('should clear all values', async () => {
        await cache.set('key1', 'value1');
        await cache.set('key2', 'value2');
        await cache.clear();

        const value1 = await cache.get('key1');
        const value2 = await cache.get('key2');

        expect(value1).toBeNull();
        expect(value2).toBeNull();
    });
});
