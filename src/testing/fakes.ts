import { Photo } from '../app/core/models/photo.model';
import { photoUrl } from '../app/core/utils/photo-url';


export class MemoryStorage implements Storage {
    private data = new Map<string, string>();
    get length(): number {
        return this.data.size;
    }
    clear(): void {
        this.data.clear();
    }
    getItem(key: string): string | null {
        return this.data.get(key) ?? null;
    }
    key(index: number): string | null {
        return [...this.data.keys()][index] ?? null;
    }
    removeItem(key: string): void {
        this.data.delete(key);
    }
    setItem(key: string, value: string): void {
        this.data.set(key, String(value));
    }
}

export function makePhoto(id: string): Photo {
    return { id, url: photoUrl(id) };
}

type IOCallback = IntersectionObserverCallback;

export class FakeIntersectionObserver {
    static instances: FakeIntersectionObserver[] = [];
    readonly observed = new Set<Element>();
    observeCalls = 0;

    constructor(
        private readonly callback: IOCallback,
        readonly options?: IntersectionObserverInit,
    ) {
        FakeIntersectionObserver.instances.push(this);
    }

    observe(el: Element): void {
        this.observeCalls++;
        this.observed.add(el);
    }
    unobserve(el: Element): void {
        this.observed.delete(el);
    }
    disconnect(): void {
        this.observed.clear();
    }
    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }

    trigger(isIntersecting: boolean): void {
        const entries = [...this.observed].map(
            (target) => ({ isIntersecting, target }) as IntersectionObserverEntry,
        );
        this.callback(entries, this as unknown as IntersectionObserver);
    }

    static latest(): FakeIntersectionObserver {
        return FakeIntersectionObserver.instances[FakeIntersectionObserver.instances.length - 1];
    }

    static reset(): void {
        FakeIntersectionObserver.instances = [];
    }
}