import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, provideRouter } from '@angular/router';
import { BROWSER_STORAGE } from '../../core/services/storage.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { MemoryStorage, makePhoto } from '../../../testing/fakes';
import { PhotoDetailPage } from './photo-detail-page';

describe('PhotoDetailPage', () => {
    let fixture: ComponentFixture<PhotoDetailPage>;
    let favorites: FavoritesService;
    const snackBar = { open: vi.fn() };

    beforeEach(() => {
        snackBar.open.mockClear();
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                { provide: MatSnackBar, useValue: snackBar },
                { provide: BROWSER_STORAGE, useValue: new MemoryStorage() },
            ],
        });
        favorites = TestBed.inject(FavoritesService);
    });

    async function render(id: string): Promise<HTMLElement> {
        fixture = TestBed.createComponent(PhotoDetailPage);
        fixture.componentRef.setInput('id', id);
        await fixture.whenStable();
        return fixture.nativeElement;
    }

    const removeButton = (el: HTMLElement) =>
        Array.from(el.querySelectorAll('button')).find((b) =>
            b.textContent?.includes('Remove from favorites'),
        );

    it('shows the photo full size', async () => {
        const el = await render('abc');
        expect(el.querySelector('img')?.getAttribute('src')).toBe(
            'https://picsum.photos/seed/abc/1200/1800',
        );
    });

    it('shows a loader until the image has loaded', async () => {
        const el = await render('abc');
        expect(el.querySelector('app-loader')).not.toBeNull();
        el.querySelector('img')!.dispatchEvent(new Event('load'));
        await fixture.whenStable();
        expect(el.querySelector('app-loader')).toBeNull();
    });

    it('removes the photo from favorites and returns to the list', async () => {
        favorites.add(makePhoto('abc'));
        const el = await render('abc');
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

        removeButton(el)!.click();

        expect(favorites.isFavorite('abc')).toBe(false);
        expect(snackBar.open).toHaveBeenCalledWith('Removed from favorites', undefined, expect.anything());
        expect(navigate).toHaveBeenCalledWith(['/favorites']);
    });

    it('explains when the photo is not a favorite', async () => {
        const el = await render('unknown');
        expect(removeButton(el)).toBeUndefined();
        expect(el.textContent).toContain("isn't in your favorites");
    });

    it('reacts to the route id changing', async () => {
        const el = await render('one');
        fixture.componentRef.setInput('id', 'two');
        await fixture.whenStable();
        expect(el.querySelector('img')?.getAttribute('src')).toContain('/seed/two/');
    });
});