import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { BROWSER_STORAGE } from '../../core/services/storage.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { MemoryStorage, makePhoto } from '../../../testing/fakes';
import { FavoritesPage } from './favorites-page';

describe('FavoritesPage', () => {
    let fixture: ComponentFixture<FavoritesPage>;
    let favorites: FavoritesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([]), { provide: BROWSER_STORAGE, useValue: new MemoryStorage() }],
        });
        favorites = TestBed.inject(FavoritesService);
    });

    async function render(): Promise<HTMLElement> {
        fixture = TestBed.createComponent(FavoritesPage);
        await fixture.whenStable();
        return fixture.nativeElement;
    }

    it('shows an empty state linking to the stream', async () => {
        const el = await render();
        expect(el.querySelector('app-empty-state')).not.toBeNull();
        expect(el.querySelector('a[href="/"]')).not.toBeNull();
    });

    it('lists all favorites', async () => {
        favorites.add(makePhoto('a'));
        favorites.add(makePhoto('b'));
        const el = await render();
        expect(el.querySelectorAll('button.card')).toHaveLength(2);
        expect(el.querySelector('app-empty-state')).toBeNull();
    });

    it('opens the single photo page on click', async () => {
        favorites.add(makePhoto('a'));
        const el = await render();
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

        (el.querySelector('button.card') as HTMLButtonElement).click();
        expect(navigate).toHaveBeenCalledWith(['/photos', 'a']);
    });

    it('updates when favorites change', async () => {
        favorites.add(makePhoto('a'));
        const el = await render();
        favorites.remove('a');
        await fixture.whenStable();
        expect(el.querySelector('app-empty-state')).not.toBeNull();
    });
});