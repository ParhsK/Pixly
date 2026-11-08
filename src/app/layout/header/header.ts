import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { FavouritesService } from '../../core/services/favourites.service';

export type View = 'photos' | 'favorites';

export function viewForUrl(url: string): View {
    const path = url.split(/[?#]/)[0];
    return path.startsWith('/favorites') || path.startsWith('/photos/') ? 'favorites' : 'photos';
}

@Component({
    selector: 'app-header',
    imports: [MatToolbar, MatButton, MatIcon, RouterLink],
    templateUrl: './header.html',
    styleUrl: './header.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
    private readonly router = inject(Router);
    protected readonly favorites = inject(FavouritesService);

    private readonly url = toSignal(
        this.router.events.pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
            map((e) => e.urlAfterRedirects),
        ),
        { initialValue: this.router.url },
    );

    protected readonly activeView = computed(() => viewForUrl(this.url()));
}