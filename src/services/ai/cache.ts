/**
 * Simple In-Memory Cache with TTL
 * كاش بسيط في الذاكرة مع مدة صلاحية
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttlMinutes: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Get or compute: returns cached data or executes the factory function
   */
  async getOrCompute<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMinutes: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const data = await factory();
    this.set(key, data, ttlMinutes);
    return data;
  }

  /**
   * Clear all entries or entries matching a prefix
   */
  clear(prefix?: string): void {
    if (!prefix) {
      this.store.clear();
      return;
    }

    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    // Cleanup expired
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) this.store.delete(key);
    }

    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }
}

// Singleton instance
export const aiCache = new MemoryCache();
