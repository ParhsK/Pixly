import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Photo } from '../../core/models/photo.model';
import { BROWSER_STORAGE } from '../../core/services/storage.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { FakeIntersectionObserver, MemoryStorage, makePhoto } from '../../../testing/fakes';
import { PhotoStreamStore } from './photo-stream.store';
import { PhotosPage } from './photos-page';

describe('PhotosPage', () => {
    let fixture: ComponentFixture<PhotosPage>;
    let favorites: FavoritesService;
    const photos = signal<readonly Photo[]>([]);
    const loading = signal(false);
    const error = signal(false);
    const store = {
        photos,
        loading,
        error,
        loadMore: vi.fn(),
        ensureLoaded: vi.fn(),
    };
    const snackBar = { open: vi.fn() };

    beforeEach(async () => {
        FakeIntersectionObserver.reset();
        vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
        photos.set([makePhoto('a'), makePhoto('b')]);
        loading.set(false);
        error.set(false);
        store.loadMore.mockClear();
        store.ensureLoaded.mockClear();
        snackBar.open.mockClear();

        TestBed.configureTestingModule({
            providers: [
                { provide: PhotoStreamStore, useValue: store },
                { provide: MatSnackBar, useValue: snackBar },
                { provide: BROWSER_STORAGE, useValue: new MemoryStorage() },
            ],
        });
        favorites = TestBed.inject(FavoritesService);
        fixture = TestBed.createComponent(PhotosPage);
        await fixture.whenStable();
    });

    afterEach(() => vi.unstubAllGlobals());

    const el = () => fixture.nativeElement as HTMLElement;
    const cards = () => Array.from(el().querySelectorAll('button.card')) as HTMLButtonElement[];

    it('loads the first page on creation', () => {
        expect(store.ensureLoaded).toHaveBeenCalled();
    });

    it('renders the stream', () => {
        expect(cards()).toHaveLength(2);
    });

    it('adds a clicked photo to favorites and confirms it', async () => {
        cards()[0].click();
        await fixture.whenStable();

        expect(favorites.isFavorite('a')).toBe(true);
        expect(snackBar.open).toHaveBeenCalledWith('Added to favorites', undefined, expect.anything());
        expect(cards()[0].querySelector('.badge')).not.toBeNull();
    });

    it('tells the user when a photo is already a favorite', () => {
        favorites.add(makePhoto('a'));
        cards()[0].click();
        expect(snackBar.open).toHaveBeenCalledWith('Already in favorites', undefined, expect.anything());
        expect(favorites.count()).toBe(1);
    });

    it('loads more when the sentinel scrolls into view', () => {
        FakeIntersectionObserver.latest().trigger(true);
        expect(store.loadMore).toHaveBeenCalledTimes(1);
    });

    it('shows the loader while loading and does not request more', async () => {
        loading.set(true);
        await fixture.whenStable();
        expect(el().querySelector('app-loader')).not.toBeNull();

        FakeIntersectionObserver.latest().trigger(true);
        expect(store.loadMore).not.toHaveBeenCalled();
    });

    it('hides the loader when idle', () => {
        expect(el().querySelector('app-loader')).toBeNull();
    });

    it('offers a retry after an error', async () => {
        error.set(true);
        await fixture.whenStable();
        const retry = el().querySelector('[role="alert"] button') as HTMLButtonElement;
        expect(retry.textContent).toContain('Try again');
        retry.click();
        expect(store.loadMore).toHaveBeenCalled();
    });
});