import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Photo } from '../../../core/models/photo.model';
import { makePhoto } from '../../../../testing/fakes';
import { PhotoGrid } from './photo-grid';

describe('PhotoGrid', () => {
    let fixture: ComponentFixture<PhotoGrid>;
    const photos = [makePhoto('a'), makePhoto('b'), makePhoto('c')];

    beforeEach(async () => {
        fixture = TestBed.createComponent(PhotoGrid);
        fixture.componentRef.setInput('photos', photos);
        fixture.componentRef.setInput('isFavorite', (id: string) => id === 'b');
        fixture.componentRef.setInput('actionLabel', 'Add to favorites');
        await fixture.whenStable();
    });

    const cards = () =>
        Array.from(fixture.nativeElement.querySelectorAll('button.card')) as HTMLButtonElement[];

    it('renders one card per photo with its image', () => {
        expect(cards()).toHaveLength(3);
        const img = cards()[0].querySelector('img')!;
        expect(img.getAttribute('src')).toBe(photos[0].url);
        expect(img.getAttribute('loading')).toBe('lazy');
    });

    it('shows the favorite badge only where the predicate matches', () => {
        expect(cards().map((c) => !!c.querySelector('.badge'))).toEqual([false, true, false]);
    });

    it('labels cards with the action', () => {
        expect(cards()[0].getAttribute('aria-label')).toBe('Add to favorites');
    });

    it('emits the clicked photo', () => {
        let selected: Photo | undefined;
        fixture.componentInstance.photoSelected.subscribe((p) => (selected = p));
        cards()[2].click();
        expect(selected).toEqual(photos[2]);
    });

    it('fades the image in once it has loaded', async () => {
        const card = cards()[0];
        expect(card.classList).not.toContain('loaded');
        card.querySelector('img')!.dispatchEvent(new Event('load'));
        await fixture.whenStable();
        expect(card.classList).toContain('loaded');
    });
});