// Emualtes an API for fetching photos.

import { Injectable } from '@angular/core';
import { Observable, defer, timer, map } from 'rxjs';
import { Photo } from '../models/photo.model';
import { photoUrl } from '../utils/photo-url';

export const MIN_LATENCY_MS = 200;
export const MAX_LATENCY_MS = 300;

@Injectable({ providedIn: 'root' })
export class PhotoApiService {
    getPhotos(limit: number): Observable<Photo[]> {
        return defer(() => {
            const photos = Array.from({ length: limit }, () => this.createRandomPhoto());
            return timer(this.randomLatency()).pipe(map(() => photos));
        });
    }

    randomLatency(): number {
        return MIN_LATENCY_MS + Math.floor(Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS));
    }

    private createRandomPhoto(): Photo {
        const id = Math.random().toString(36).substring(2, 10);
        return { id, url: photoUrl(id) };
    }
}