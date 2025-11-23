import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ICacheRepository } from '../../../application/ports';

interface CacheDB extends DBSchema {
    'cache-entries': {
        key: string;
        value: {
            value: any;
            expiresAt: number | null;
        };
    };
}

export interface IndexedDBCacheConfig {
    dbName?: string;
    storeName?: string;
    defaultTTL?: number;
    cleanupInterval?: number;
}

export class IndexedDBCacheAdapter<T> implements ICacheRepository<T> {
    private dbPromise: Promise<IDBPDatabase<CacheDB>>;
    private config: Required<IndexedDBCacheConfig>;
    private cleanupTimer?: NodeJS.Timeout;

    constructor(config: IndexedDBCacheConfig = {}) {
        this.config = {
            dbName: config.dbName ?? 'comic-blog-cache',
            storeName: config.storeName ?? 'cache-entries',
            defaultTTL: config.defaultTTL ?? 5 * 60 * 1000, // 5 minutes
            cleanupInterval: config.cleanupInterval ?? 60 * 1000, // 1 minute
        };

        this.dbPromise = openDB<CacheDB>(this.config.dbName, 1, {
            upgrade(db) {
                db.createObjectStore('cache-entries');
            },
        });

        this.startCleanupTimer();
    }

    private startCleanupTimer(): void {
        this.cleanupTimer = setInterval(() => {
            this.cleanupExpired();
        }, this.config.cleanupInterval);

        if (typeof this.cleanupTimer.unref === 'function') {
            this.cleanupTimer.unref();
        }
    }

    public stopCleanupTimer(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = undefined;
        }
    }

    private async cleanupExpired(): Promise<void> {
        const db = await this.dbPromise;
        const tx = db.transaction('cache-entries', 'readwrite');
        const store = tx.objectStore('cache-entries');
        const now = Date.now();

        let cursor = await store.openCursor();

        while (cursor) {
            const entry = cursor.value;
            if (entry.expiresAt !== null && entry.expiresAt < now) {
                await cursor.delete();
            }
            cursor = await cursor.continue();
        }

        await tx.done;
    }

    async get(key: string): Promise<T | null> {
        const db = await this.dbPromise;
        const entry = await db.get('cache-entries', key);

        if (!entry) {
            return null;
        }

        if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
            await db.delete('cache-entries', key);
            return null;
        }

        return entry.value;
    }

    async set(key: string, value: T, ttl?: number): Promise<void> {
        const db = await this.dbPromise;
        const actualTTL = ttl ?? this.config.defaultTTL;
        const expiresAt = actualTTL > 0 ? Date.now() + actualTTL : null;

        await db.put('cache-entries', {
            value,
            expiresAt,
        }, key);
    }

    async delete(key: string): Promise<void> {
        const db = await this.dbPromise;
        await db.delete('cache-entries', key);
    }

    async deletePattern(pattern: string): Promise<void> {
        const db = await this.dbPromise;
        const tx = db.transaction('cache-entries', 'readwrite');
        const store = tx.objectStore('cache-entries');

        // Convert pattern to regex
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        const regex = new RegExp(`^${regexPattern}$`);

        let cursor = await store.openCursor();

        while (cursor) {
            if (regex.test(cursor.key)) {
                await cursor.delete();
            }
            cursor = await cursor.continue();
        }

        await tx.done;
    }

    async clear(): Promise<void> {
        const db = await this.dbPromise;
        await db.clear('cache-entries');
    }

    async has(key: string): Promise<boolean> {
        const val = await this.get(key);
        return val !== null;
    }
}
