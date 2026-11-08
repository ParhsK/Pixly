import { TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../../testing/fakes';
import { BROWSER_STORAGE, StorageService } from './storage.service';

describe('StorageService', () => {
    let storage: MemoryStorage;
    let service: StorageService;

    beforeEach(() => {
        storage = new MemoryStorage();
        TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: storage }] });
        service = TestBed.inject(StorageService);
    });

    it('round-trips JSON values', () => {
        service.set('key', { a: 1, b: ['x'] });
        expect(storage.getItem('key')).toBe('{"a":1,"b":["x"]}');
        expect(service.get('key', null)).toEqual({ a: 1, b: ['x'] });
    });

    it('returns the fallback for missing keys', () => {
        expect(service.get('missing', 42)).toBe(42);
    });

    it('returns the fallback for corrupt JSON', () => {
        storage.setItem('key', '{not json');
        expect(service.get('key', 'fallback')).toBe('fallback');
    });

    it('removes keys', () => {
        service.set('key', 1);
        service.remove('key');
        expect(storage.getItem('key')).toBeNull();
    });

    it('swallows write errors (e.g. quota exceeded)', () => {
        vi.spyOn(storage, 'setItem').mockImplementation(() => {
            throw new Error('QuotaExceededError');
        });
        expect(() => service.set('key', 1)).not.toThrow();
    });

    it('works without any storage available', () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: null }] });
        const noStorage = TestBed.inject(StorageService);
        noStorage.set('key', 1);
        expect(noStorage.get('key', 'fallback')).toBe('fallback');
    });
});