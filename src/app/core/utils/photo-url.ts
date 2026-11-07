const PICSUM_BASE = 'https://picsum.photos';

export const THUMB_WIDTH = 200;
export const THUMB_HEIGHT = 300;

export function photoUrl(id: string, width: number = THUMB_WIDTH, height: number = THUMB_HEIGHT): string {
    return `${PICSUM_BASE}/seed/${encodeURIComponent(id)}/${width}/${height}`;
}

export function fullSizePhotoUrl(id: string): string {
    return photoUrl(id, THUMB_WIDTH * 6, THUMB_HEIGHT * 6);
}