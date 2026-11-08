import { TestBed } from '@angular/core/testing';
import { MemoryStorage, makePhoto } from '../../../testing/fakes';
import { FAVORITES_STORAGE_KEY, FavoritesService } from './favorites.service';
import { BROWSER_STORAGE } from './storage.service';

describe('FavoritesService', () => {
    let storage: MemoryStorage;

    function createService(): FavoritesService {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: storage }] });
        return TestBed.inject(FavoritesService);
    }

    beforeEach(() => {
        storage = new MemoryStorage();
    });

    it('starts empty', () => {
        const service = createService();
        expect(service.favorites()).toEqual([]);
        expect(service.count()).toBe(0);
    });

    it('adds photos in order and reports membership', () => {
        const service = createService();
        expect(service.add(makePhoto('a'))).toBe(true);
        expect(service.add(makePhoto('b'))).toBe(true);

        expect(service.favorites().map((p) => p.id)).toEqual(['a', 'b']);
        expect(service.count()).toBe(2);
        expect(service.isFavorite('a')).toBe(true);
        expect(service.isFavorite('zzz')).toBe(false);
        expect(service.get('b')).toEqual(makePhoto('b'));
    });

    it('does not add duplicates', () => {
        const service = createService();
        service.add(makePhoto('a'));
        expect(service.add(makePhoto('a'))).toBe(false);
        expect(service.count()).toBe(1);
    });

    it('removes photos', () => {
        const service = createService();
        service.add(makePhoto('a'));
        service.add(makePhoto('b'));

        expect(service.remove('a')).toBe(true);
        expect(service.favorites().map((p) => p.id)).toEqual(['b']);
        expect(service.remove('a')).toBe(false);
    });

    it('persists across a "page refresh" (new service instance)', () => {
        const first = createService();
        first.add(makePhoto('a'));
        first.add(makePhoto('b'));
        first.remove('a');

        const afterRefresh = createService();
        expect(afterRefresh.favorites()).toEqual([makePhoto('b')]);
    });

    it('ignores malformed stored data', () => {
        storage.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify([makePhoto('ok'), { id: 1 }, null, 'nope', { id: 'x' }]),
        );
        expect(createService().favorites()).toEqual([makePhoto('ok')]);

        storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ not: 'an array' }));
        expect(createService().favorites()).toEqual([]);
    });
});