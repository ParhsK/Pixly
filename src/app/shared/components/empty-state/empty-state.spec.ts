import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

@Component({
    imports: [EmptyState],
    template: `<app-empty-state icon="favorite" title="Nothing here" message="Add some">
    <button class="cta">Go</button>
  </app-empty-state>`,
})
class Host { }

describe('EmptyState', () => {
    it('renders icon, title, message and projected content', async () => {
        const fixture = TestBed.createComponent(Host);
        await fixture.whenStable();
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('mat-icon')?.textContent?.trim()).toBe('favorite');
        expect(el.querySelector('h2')?.textContent).toBe('Nothing here');
        expect(el.querySelector('p')?.textContent).toBe('Add some');
        expect(el.querySelector('.cta')).not.toBeNull();
    });
});