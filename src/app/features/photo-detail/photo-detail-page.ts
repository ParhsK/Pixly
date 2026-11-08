import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { fullSizePhotoUrl } from '../../core/utils/photo-url';
import { Loader } from '../../shared/components/loader/loader';

@Component({
    selector: 'app-photo-detail-page',
    imports: [MatButton, MatIcon, RouterLink, Loader],
    templateUrl: './photo-detail-page.html',
    styleUrl: './photo-detail-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailPage {
    readonly id = input.required<string>();

    private readonly favorites = inject(FavoritesService);
    private readonly router = inject(Router);
    private readonly snackBar = inject(MatSnackBar);

    protected readonly isFavorite = computed(() => this.favorites.isFavorite(this.id()));
    protected readonly imageUrl = computed(() => fullSizePhotoUrl(this.id()));
    protected readonly loaded = linkedSignal({ source: this.id, computation: () => false });

    protected remove(): void {
        if (this.favorites.remove(this.id())) {
            this.snackBar.open('Removed from favorites', undefined, { duration: 1800 });
        }
        this.router.navigate(['/favorites']);
    }
}