import { Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatSidenavModule, Header],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('blog-signal-form');
}
