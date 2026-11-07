import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-loader',
    imports: [MatProgressSpinner],
    template: `
    <div class="loader" role="status" [attr.aria-label]="label()">
      <mat-progress-spinner mode="indeterminate" [diameter]="diameter()" />
    </div>
  `,
    styles: `
    .loader {
      display: flex;
      justify-content: center;
      padding: 24px 0;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loader {
    readonly label = input('Loading');
    readonly diameter = input(40);
}