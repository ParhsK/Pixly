import {
    DestroyRef,
    Directive,
    ElementRef,
    afterNextRender,
    effect,
    inject,
    input,
    output,
} from '@angular/core';

/*
 * A guard element placed after a list;
 * `scrolled` fires whenever the guard comes within `rootMargin` of
 * the viewport and the directive is not disabled.
 *
 * While `disabled` (e.g. a page is loading) intersections are ignored. When it
 * flips back to enabled the sentinel is re-observed, which makes the browser
 * report its current state again.
 */
@Directive({ selector: '[appInfiniteScroll]' })
export class InfiniteScrollDirective {
    readonly rootMargin = input('400px');
    readonly disabled = input(false);
    readonly scrolled = output<void>();

    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
    private observer?: IntersectionObserver;

    constructor() {
        afterNextRender(() => {
            if (typeof IntersectionObserver === 'undefined') {
                return;
            }
            this.observer = new IntersectionObserver((entries) => this.onIntersect(entries), {
                rootMargin: this.rootMargin(),
            });
            this.observer.observe(this.host.nativeElement);
        });

        effect(() => {
            if (!this.disabled() && this.observer) {
                this.observer.unobserve(this.host.nativeElement);
                this.observer.observe(this.host.nativeElement);
            }
        });

        inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
    }

    private onIntersect(entries: IntersectionObserverEntry[]): void {
        if (!this.disabled() && entries.some((entry) => entry.isIntersecting)) {
            this.scrolled.emit();
        }
    }
}