import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Photo } from '../../../core/models/photo.model';
import { PhotoCard } from '../photo-card/photo-card';

@Component({
    selector: 'app-photo-grid',
    imports: [PhotoCard],
    template: `
    <ul class="grid">
      @for (photo of photos(); track photo.id) {
        <li>
          <app-photo-card
            [photo]="photo"
            [favorite]="isFavorite()(photo.id)"
            [actionLabel]="actionLabel()"
            (selected)="photoSelected.emit($event)"
          />
        </li>
      }
    </ul>
  `,
    styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    @media (max-width: 480px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGrid {
    readonly photos = input.required<readonly Photo[]>();
    readonly isFavorite = input<(id: string) => boolean>(() => false);
    readonly actionLabel = input('Open photo');
    readonly photoSelected = output<Photo>();
}