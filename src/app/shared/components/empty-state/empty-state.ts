//Shown when favorites is empty.

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-empty-state',
    imports: [MatIcon],
    template: `
    <mat-icon class="icon" aria-hidden="true">{{ icon() }}</mat-icon>
    <h2 class="title">{{ title() }}</h2>
    @if (message()) {
      <p class="message">{{ message() }}</p>
    }
    <ng-content />
  `,
    styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 64px 16px;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
    }
    .icon {
      width: 56px;
      height: 56px;
      font-size: 56px;
      color: var(--mat-sys-primary);
    }
    .title {
      margin: 8px 0 0;
      font: var(--mat-sys-title-large);
      color: var(--mat-sys-on-surface);
    }
    .message {
      margin: 0 0 16px;
      max-width: 36ch;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
    readonly icon = input('photo_library');
    readonly title = input.required<string>();
    readonly message = input('');
}