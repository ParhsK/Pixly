import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Photo } from '../../core/models/photo.model';
import { FavouritesService } from '../../core/services/favourites.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { PhotoGrid } from '../../shared/components/photo-grid/photo-grid';

@Component({
    selector: 'app-favorites-page',
    imports: [PhotoGrid, EmptyState, MatButton, RouterLink],
    template: `
    <h1 class="visually-hidden">Favorites</h1>
    @if (favorites.count() > 0) {
      <app-photo-grid
        [photos]="favorites.favorites()"
        actionLabel="Open photo"
        (photoSelected)="open($event)"
      />
    } @else {
      <app-empty-state
        icon="favorite"
        title="No favorites yet"
        message="Tap any photo in the stream to save it here."
      >
        <a mat-flat-button routerLink="/">Browse photos</a>
      </app-empty-state>
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPage {
    protected readonly favorites = inject(FavouritesService);
    private readonly router = inject(Router);

    protected open(photo: Photo): void {
        this.router.navigate(['/photos', photo.id]);
    }
}