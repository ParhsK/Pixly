import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Photo } from '../../../core/models/photo.model';
import { THUMB_HEIGHT, THUMB_WIDTH } from '../../../core/utils/photo-url';


@Component({
    selector: 'app-photo-card',
    imports: [MatIcon],
    templateUrl: './photo-card.html',
    styleUrl: './photo-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCard {
    readonly photo = input.required<Photo>();
    readonly favorite = input(false);
    readonly actionLabel = input('Open photo');
    readonly selected = output<Photo>();

    protected readonly loaded = signal(false);
    protected readonly width = THUMB_WIDTH;
    protected readonly height = THUMB_HEIGHT;
}