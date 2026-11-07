// Source of thuth for  the favourites list.

import { Injectable, computed, inject, signal } from '@angular/core';
import { Photo } from '../models/photo.model';
import { StorageService } from './storage.service';

export const FAVORITES_STORAGE_KEY = 'photo-library.favorites';

function isPhoto(value: unknown): value is Photo {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as Photo).id === 'string' &&
        typeof (value as Photo).url === 'string'
    );
}

@Injectable({ providedIn: 'root' })
export class FavouritesService {
    private readonly storage = inject(StorageService);
    private readonly _favorites = signal<readonly Photo[]>(this.restore());

    readonly favorites = this._favorites.asReadonly();
    readonly count = computed(() => this._favorites().length);
    private readonly ids = computed(() => new Set(this._favorites().map((p) => p.id)));

    isFavorite(id: string): boolean {
        return this.ids().has(id);
    }

    get(id: string): Photo | undefined {
        return this._favorites().find((p) => p.id === id);
    }

    add(photo: Photo): boolean {
        if (this.isFavorite(photo.id)) {
            return false;
        }
        this.commit([...this._favorites(), { id: photo.id, url: photo.url }]);
        return true;
    }

    remove(id: string): boolean {
        if (!this.isFavorite(id)) {
            return false;
        }
        this.commit(this._favorites().filter((p) => p.id !== id));
        return true;
    }

    private commit(next: readonly Photo[]): void {
        this._favorites.set(next);
        this.storage.set(FAVORITES_STORAGE_KEY, next);
    }

    private restore(): readonly Photo[] {
        const stored = this.storage.get<unknown>(FAVORITES_STORAGE_KEY, []);
        return Array.isArray(stored) ? stored.filter(isPhoto) : [];
    }
}