import { fullSizePhotoUrl, photoUrl } from './photo-url';

describe('photo-url', () => {
    it('builds a seeded thumbnail url', () => {
        expect(photoUrl('abc')).toBe('https://picsum.photos/seed/abc/200/300');
    });

    it('builds custom sizes and encodes the id', () => {
        expect(photoUrl('a b/c', 10, 20)).toBe('https://picsum.photos/seed/a%20b%2Fc/10/20');
    });

    it('builds a large url with the same 2:3 ratio', () => {
        expect(fullSizePhotoUrl('abc')).toBe('https://picsum.photos/seed/abc/1200/1800');
    });
});