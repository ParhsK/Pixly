import { Injectable, InjectionToken, inject } from '@angular/core';

/** Web Storage usage */
export const BROWSER_STORAGE = new InjectionToken<Storage | null>('BROWSER_STORAGE', {
    providedIn: 'root',
    factory: () => {
        try {
            return typeof localStorage === 'undefined' ? null : localStorage;
        } catch (e) {
            return null;
        }
    }
});

@Injectable({ providedIn: 'root' })
export class StorageService {
    private readonly storage: Storage | null = inject(BROWSER_STORAGE);
    get<T>(key: string, fallback: T): T {
        try {
            const raw = this.storage?.getItem(key);
            return raw == null ? fallback : (JSON.parse(raw) as T);
        } catch {
            return fallback;
        }
    }

    set<T>(key: string, value: T): void {
        try {
            this.storage?.setItem(key, JSON.stringify(value));
        } catch {
            // Quota exceeded or storage is unavailable, work in memory.
        }
    }

    remove(key: string): void {
        try {
            this.storage?.removeItem(key);
        } catch {
            // ignore
        }
    }
}