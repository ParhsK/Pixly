import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  template: `
    <app-header />
    <main class="page">
      <router-outlet />
    </main>
  `,
  styles: `
    .page {
      max-width: 1280px;
      margin: 0 auto;
      padding: var(--app-page-padding);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App { }