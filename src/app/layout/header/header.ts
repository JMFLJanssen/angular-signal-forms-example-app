import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

/**
 * The header always shown containing the homepage and the CMS menu selections.
 */
@Component({
    selector: 'header',
    imports: [CommonModule, MatIconModule, RouterLink, MatListModule],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {
    // Signal the open menu animation to start when set to true
    isShown = model(false);

    // Menu toggle
    toggle() {
        this.isShown.update((isShown) => !isShown);
    }

    // Menu close
    close() {
        this.isShown.set(false);
    }
}
