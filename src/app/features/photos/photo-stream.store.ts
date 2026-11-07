import { Injectable, inject, signal } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { Photo } from '../../core/models/photo.model';
import { PhotoApiService } from '../../core/services/photo-api.service';

export const PAGE_SIZE = 24;

@Injectable({ providedIn: 'root' })
export class PhotoStreamStore {
    private readonly api = inject(PhotoApiService);
    private request?: Subscription;

    private readonly _photos = signal<readonly Photo[]>([]);
    private readonly _loading = signal(false);
    private readonly _error = signal(false);

    readonly photos = this._photos.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    loadMore(): void {
        if (this._loading()) {
            return;
        }
        this._loading.set(true);
        this._error.set(false);
        this.request = this.api
            .getPhotos(PAGE_SIZE)
            .pipe(finalize(() => this._loading.set(false)))
            .subscribe({
                next: (page) => this._photos.update((photos) => [...photos, ...page]),
                error: () => this._error.set(true),
            });
    }

    ensureLoaded(): void {
        if (this._photos().length === 0) {
            this.loadMore();
        }
    }

    reset(): void {
        this.request?.unsubscribe();
        this._photos.set([]);
        this._loading.set(false);
        this._error.set(false);
    }
}