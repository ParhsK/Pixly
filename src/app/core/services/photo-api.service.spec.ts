import { TestBed } from '@angular/core/testing';
import { Photo } from '../models/photo.model';
import { MAX_LATENCY_MS, MIN_LATENCY_MS, PhotoApiService } from './photo-api.service';

describe('PhotoApiService', () => {
    let service: PhotoApiService;

    beforeEach(() => {
        vi.useFakeTimers();
        service = TestBed.inject(PhotoApiService);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('keeps latency within 200–300ms', () => {
        const random = vi.spyOn(Math, 'random');
        random.mockReturnValue(0);
        expect(service.randomLatency()).toBe(MIN_LATENCY_MS);
        random.mockReturnValue(0.999999);
        expect(service.randomLatency()).toBe(MAX_LATENCY_MS);

        random.mockRestore();
        for (let i = 0; i < 200; i++) {
            const latency = service.randomLatency();
            expect(latency).toBeGreaterThanOrEqual(200);
            expect(latency).toBeLessThanOrEqual(300);
        }
    });

    it('emits the requested number of photos only after the delay', () => {
        vi.spyOn(service, 'randomLatency').mockReturnValue(250);
        let result: Photo[] | undefined;

        service.getPhotos(5).subscribe((photos) => (result = photos));

        vi.advanceTimersByTime(249);
        expect(result).toBeUndefined();

        vi.advanceTimersByTime(1);
        expect(result).toHaveLength(5);
    });

    it('returns unique ids with matching picsum urls', () => {
        vi.spyOn(service, 'randomLatency').mockReturnValue(200);
        let result: Photo[] = [];
        service.getPhotos(50).subscribe((photos) => (result = photos));
        vi.advanceTimersByTime(200);

        expect(new Set(result.map((p) => p.id)).size).toBe(50);
        for (const photo of result) {
            expect(photo.url).toBe(`https://picsum.photos/seed/${photo.id}/200/300`);
        }
    });

    it('generates a fresh page for every subscription', () => {
        vi.spyOn(service, 'randomLatency').mockReturnValue(200);
        const request = service.getPhotos(3);
        const pages: Photo[][] = [];
        request.subscribe((p) => pages.push(p));
        request.subscribe((p) => pages.push(p));
        vi.advanceTimersByTime(200);

        expect(pages[0].map((p) => p.id)).not.toEqual(pages[1].map((p) => p.id));
    });
});