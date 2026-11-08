import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FakeIntersectionObserver } from '../../../testing/fakes';
import { InfiniteScrollDirective } from './infinite-scroll.directive';

@Component({
    imports: [InfiniteScrollDirective],
    template: `<div
    appInfiniteScroll
    rootMargin="100px"
    [disabled]="disabled()"
    (scrolled)="count = count + 1"
  ></div>`,
})
class Host {
    readonly disabled = signal(false);
    count = 0;
}

describe('InfiniteScrollDirective', () => {
    let fixture: ComponentFixture<Host>;

    beforeEach(async () => {
        FakeIntersectionObserver.reset();
        vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
        fixture = TestBed.createComponent(Host);
        await fixture.whenStable();
    });

    afterEach(() => vi.unstubAllGlobals());

    it('observes the host element with the configured root margin', () => {
        const observer = FakeIntersectionObserver.latest();
        expect(observer.options?.rootMargin).toBe('100px');
        expect(observer.observed.has(fixture.nativeElement.querySelector('div'))).toBe(true);
    });

    it('emits when the sentinel becomes visible', () => {
        FakeIntersectionObserver.latest().trigger(true);
        expect(fixture.componentInstance.count).toBe(1);
    });

    it('does not emit when the sentinel leaves the viewport', () => {
        FakeIntersectionObserver.latest().trigger(false);
        expect(fixture.componentInstance.count).toBe(0);
    });

    it('ignores intersections while disabled', async () => {
        fixture.componentInstance.disabled.set(true);
        await fixture.whenStable();
        FakeIntersectionObserver.latest().trigger(true);
        expect(fixture.componentInstance.count).toBe(0);
    });

    it('re-observes when re-enabled so a still-visible sentinel fires again', async () => {
        const observer = FakeIntersectionObserver.latest();
        fixture.componentInstance.disabled.set(true);
        await fixture.whenStable();
        const callsBefore = observer.observeCalls;

        fixture.componentInstance.disabled.set(false);
        await fixture.whenStable();
        expect(observer.observeCalls).toBe(callsBefore + 1);
    });

    it('disconnects on destroy', () => {
        const observer = FakeIntersectionObserver.latest();
        const disconnect = vi.spyOn(observer, 'disconnect');
        fixture.destroy();
        expect(disconnect).toHaveBeenCalled();
    });
});