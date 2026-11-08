import { TestBed } from '@angular/core/testing';
import { Subject, throwError } from 'rxjs';
import { Photo } from '../../core/models/photo.model';
import { PhotoApiService } from '../../core/services/photo-api.service';
import { makePhoto } from '../../../testing/fakes';
import { PAGE_SIZE, PhotoStreamStore } from './photo-stream.store';

describe('PhotoStreamStore', () => {
    let store: PhotoStreamStore;
    let pending: Subject<Photo[]>[];
    let api: { getPhotos: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        pending = [];
        api = {
            getPhotos: vi.fn(() => {
                const page = new Subject<Photo[]>();
                pending.push(page);
                return page;
            }),
        };
        TestBed.configureTestingModule({ providers: [{ provide: PhotoApiService, useValue: api }] });
        store = TestBed.inject(PhotoStreamStore);
    });

    function respond(ids: string[]): void {
        const page = pending.shift()!;
        page.next(ids.map(makePhoto));
        page.complete();
    }

    it('requests a page of PAGE_SIZE and toggles loading', () => {
        store.loadMore();
        expect(api.getPhotos).toHaveBeenCalledWith(PAGE_SIZE);
        expect(store.loading()).toBe(true);

        respond(['a', 'b']);
        expect(store.loading()).toBe(false);
        expect(store.photos().map((p) => p.id)).toEqual(['a', 'b']);
    });

    it('appends subsequent pages', () => {
        store.loadMore();
        respond(['a']);
        store.loadMore();
        respond(['b', 'c']);
        expect(store.photos().map((p) => p.id)).toEqual(['a', 'b', 'c']);
    });

    it('ignores loadMore while a request is in flight', () => {
        store.loadMore();
        store.loadMore();
        store.loadMore();
        expect(api.getPhotos).toHaveBeenCalledTimes(1);
    });

    it('ensureLoaded only loads when the stream is empty', () => {
        store.ensureLoaded();
        respond(['a']);
        store.ensureLoaded();
        expect(api.getPhotos).toHaveBeenCalledTimes(1);
    });

    it('flags errors and recovers on retry', () => {
        api.getPhotos.mockReturnValueOnce(throwError(() => new Error('boom')));
        store.loadMore();
        expect(store.error()).toBe(true);
        expect(store.loading()).toBe(false);

        store.loadMore();
        expect(store.error()).toBe(false);
        respond(['a']);
        expect(store.photos()).toHaveLength(1);
    });

    it('reset clears state and cancels the in-flight request', () => {
        store.loadMore();
        respond(['a']);
        store.loadMore();
        store.reset();
        expect(store.photos()).toEqual([]);
        expect(store.loading()).toBe(false);
        expect(pending[0].observed).toBe(false);
    });
});