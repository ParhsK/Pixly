import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { BROWSER_STORAGE } from '../../core/services/storage.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { MemoryStorage, makePhoto } from '../../../testing/fakes';
import { Header, viewForUrl } from './header';

@Component({ template: '' })
class Blank { }

describe('viewForUrl', () => {
    it.each([
        ['/', 'photos'],
        ['/?x=1', 'photos'],
        ['/favorites', 'favorites'],
        ['/photos/abc', 'favorites'],
        ['/unknown', 'photos'],
    ])('%s -> %s', (url, view) => {
        expect(viewForUrl(url)).toBe(view);
    });
});

describe('Header', () => {
    let harness: RouterTestingHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [Header],
            providers: [
                provideRouter([
                    { path: '', component: Blank },
                    { path: 'favorites', component: Blank },
                    { path: 'photos/:id', component: Blank },
                ]),
                { provide: BROWSER_STORAGE, useValue: new MemoryStorage() },
            ],
        });
        harness = await RouterTestingHarness.create();
    });

    async function renderAt(url: string): Promise<HTMLElement> {
        await harness.navigateByUrl(url);
        const fixture = TestBed.createComponent(Header);
        await fixture.whenStable();
        return fixture.nativeElement;
    }

    const link = (el: HTMLElement, id: string) =>
        el.querySelector(`[data-testid="${id}"]`) as HTMLAnchorElement;

    it('has two navigation buttons pointing at both views', async () => {
        const el = await renderAt('/');
        expect(link(el, 'nav-photos').getAttribute('href')).toBe('/');
        expect(link(el, 'nav-favorites').getAttribute('href')).toBe('/favorites');
    });

    it('highlights Photos on /', async () => {
        const el = await renderAt('/');
        expect(link(el, 'nav-photos').classList).toContain('active');
        expect(link(el, 'nav-photos').getAttribute('aria-current')).toBe('page');
        expect(link(el, 'nav-favorites').classList).not.toContain('active');
    });

    it('highlights Favorites on /favorites and on a single photo', async () => {
        for (const url of ['/favorites', '/photos/abc']) {
            const el = await renderAt(url);
            expect(link(el, 'nav-favorites').classList).toContain('active');
            expect(link(el, 'nav-photos').classList).not.toContain('active');
        }
    });

    it('follows navigation after it is created', async () => {
        await harness.navigateByUrl('/');
        const fixture = TestBed.createComponent(Header);
        await fixture.whenStable();
        const el: HTMLElement = fixture.nativeElement;
        expect(link(el, 'nav-photos').classList).toContain('active');

        await harness.navigateByUrl('/favorites');
        await fixture.whenStable();
        expect(link(el, 'nav-favorites').classList).toContain('active');
        expect(link(el, 'nav-photos').classList).not.toContain('active');
    });

    it('hides the favorites count when there are none', async () => {
        const el = await renderAt('/');
        expect(el.querySelector('.count')).toBeNull();
    });

    it('shows the favorites count', async () => {
        TestBed.inject(FavoritesService).add(makePhoto('a'));
        TestBed.inject(FavoritesService).add(makePhoto('b'));
        const el = await renderAt('/');
        expect(el.querySelector('.count')?.textContent?.trim()).toBe('2');
    });
});