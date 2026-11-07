import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Photo } from '../../core/models/photo.model';
import { FavouritesService } from '../../core/services/favourites.service';
import { Loader } from '../../shared/components/loader/loader';
import { PhotoGrid } from '../../shared/components/photo-grid/photo-grid';
import { InfiniteScrollDirective } from '../../shared/directives/infinite-scroll.directive';
import { PhotoStreamStore } from './photo-stream.store';

@Component({
    selector: 'app-photos-page',
    imports: [PhotoGrid, Loader, InfiniteScrollDirective, MatButton],
    template: `
    <h1 class="visually-hidden">Photos</h1>
    <app-photo-grid
      [photos]="store.photos()"
      [isFavorite]="isFavorite"
      actionLabel="Add to favorites"
      (photoSelected)="addToFavorites($event)"
    />

    @if (store.error()) {
      <div class="error" role="alert">
        <p>Couldn't load more photos.</p>
        <button mat-stroked-button type="button" (click)="store.loadMore()">Try again</button>
      </div>
    } @else {
      <div
        class="sentinel"
        appInfiniteScroll
        [disabled]="store.loading()"
        (scrolled)="store.loadMore()"
      ></div>
    }

    @if (store.loading()) {
      <app-loader label="Loading more photos" />
    }
  `,
    styles: `
    .sentinel {
      height: 1px;
    }
    .error {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0;
      color: var(--mat-sys-error);
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosPage {
    protected readonly store = inject(PhotoStreamStore);
    private readonly favorites = inject(FavouritesService);
    private readonly snackBar = inject(MatSnackBar);

    /* arrow function instead of method because passing it to a child as [isFavorite]="isFavorite", arrow function keeps `this` pointing at the page*/
    protected readonly isFavorite = (id: string) => this.favorites.isFavorite(id);

    constructor() {
        this.store.ensureLoaded();
    }

    protected addToFavorites(photo: Photo): void {
        const added = this.favorites.add(photo);
        this.snackBar.open(added ? 'Added to favorites' : 'Already in favorites', undefined, {
            duration: 1800,
        });
    }
}