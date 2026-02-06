import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ToastrService {
    options: ToastOptions = new ToastOptions();

    private renderer: Renderer2;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    /**
     * @param title the title to show on the toast
     * @param text the text to show on the toast
     * @param type 1 of the 4 possible toast types
     * @param options for a different configuration then the defaults
     */
    showToast(title: string, text: string, type: ToastType = 'success', options?: ToastOptions) {
        // No options provided: use the defaults
        if (!options) {
            options = this.options;
        }

        // A toast container created?
        let container = document.querySelector('.toast-container');
        if (!container) {
            // Create a div element and add the toast-container class
            container = this.renderer.createElement('div');
            this.renderer.addClass(container, `toast-container`);
            // Put the container in the requested position
            this.renderer.addClass(container, `toast-${options.position}`);
            // Add this container to the body element
            const body = this.renderer.selectRootElement('body', true);
            this.renderer.appendChild(body, container);
        } else {
            // Container exists, just make sure it is in the requested position
            container.className = `toast-container toast-${options.position}`;
        }

        // Create a toast and style this with the correct classes
        const toast = this.renderer.createElement('div');
        // Default styling
        this.renderer.addClass(toast, 'toast');
        // And the correct background for the toast type
        this.renderer.addClass(toast, `toast-${type}`);
        this.renderer.setAttribute(toast, `data-theme`, 'light');

        // If the options dictate there shouldn't be a close button, a close can
        // be done by clicking directly on the toast
        if (!options.showToastCloseBtn) {
            this.renderer.listen(toast, 'click', () => {
                this.renderer.removeClass(toast, 'toast-fade-in');
                this.renderer.addClass(toast, 'toast-fade-out');
                setTimeout(() => {
                    this.renderer.removeChild(container, toast);
                }, 500);
            });
        }

        // Create a container for the content of the toast and add its default styling
        const contentContainer = this.renderer.createElement('div');
        this.renderer.addClass(contentContainer, 'toast-content-container');

        // Create another container in which its elements are aligned in the middle
        const contentContainer1 = this.renderer.createElement('div');
        this.renderer.addClass(contentContainer1, 'toast-content-container1');

        // Create the SVG
        const svgIcon = this.renderer.createElement('svg', 'http://www.w3.org/2000/svg');
        this.renderer.setAttribute(svgIcon, 'xmlns', 'http://www.w3.org/2000/svg');
        this.renderer.setAttribute(svgIcon, 'viewBox', '0 0 24 24');
        const path = this.renderer.createElement('path', 'http://www.w3.org/2000/svg');
        if (type === 'success') {
            this.renderer.setAttribute(
                path,
                'd',
                'm20.22,1.96c-2.74-.46-7.3-.46-8.22-.46s-5.48,0-8.22.46c-.95.16-1.67.88-1.83,1.83-.46,2.74-.46,7.3-.46,8.22s0,5.48.46,8.22c.16.95.88,1.67,1.83,1.83,2.74.46,7.3.46,8.22.46s5.48,0,8.22-.46c.95-.16,1.67-.88,1.83-1.83.46-2.74.46-7.3.46-8.22,0-2.74,0-5.48-.46-8.22-.16-.95-.88-1.67-1.83-1.83Zm-3.53,6.4l-4.89,8.09c-.14.23-.38.36-.64.36h0c-.26,0-.51-.14-.64-.37l-3.2-5.38c-.19-.32-.12-.73.16-.97.28-.24.69-.24.97,0l2.65,2.3,4.4-4.95c.26-.29.7-.34,1.01-.1.31.23.4.67.19,1Z',
            );
        } else if (type === 'warning') {
            this.renderer.setAttribute(
                path,
                'd',
                'm13.67,2.47c-.73-1.3-2.6-1.3-3.34,0L.62,19.64c-.72,1.28.2,2.86,1.67,2.86h19.43c1.47,0,2.39-1.58,1.67-2.86L13.67,2.47Zm-2.82,4.7l2.48-.2-.22,5.51v2.63l-2.27.05v-7.99Zm2.27,11.37c-.24.29-.6.44-1.09.44s-.85-.13-1.1-.39c-.25-.26-.38-.64-.38-1.14,0-.45.12-.82.36-1.12.24-.31.6-.46,1.09-.46s.85.14,1.1.41c.25.27.38.66.38,1.18,0,.43-.12.79-.36,1.09Z',
            );
        } else if (type === 'info') {
            this.renderer.setAttribute(
                path,
                'd',
                'm20.22,1.96c-2.74-.46-7.3-.46-8.22-.46s-5.48,0-8.22.46c-.95.16-1.67.88-1.83,1.83-.46,2.74-.46,7.3-.46,8.22s0,5.48.46,8.22c.16.95.88,1.67,1.83,1.83,2.74.46,7.3.46,8.22.46s5.48,0,8.22-.46c.95-.16,1.67-.88,1.83-1.83.46-2.74.46-7.31.46-8.22,0-2.74,0-5.48-.46-8.22-.16-.95-.88-1.67-1.83-1.83Zm-7.11,16.33h-2.21v-8.87l2.21-.09v8.96Zm-.17-10.5c-.22.25-.54.37-.95.37s-.72-.12-.95-.35c-.22-.23-.33-.53-.33-.87s.11-.63.33-.88c.22-.25.54-.38.95-.38s.72.12.95.36.33.54.33.9c0,.33-.11.61-.33.86Z',
            );
        } else if (type === 'error') {
            this.renderer.setAttribute(
                path,
                'd',
                'm12,1.5C6.2,1.5,1.5,6.2,1.5,12s4.7,10.5,10.5,10.5,10.5-4.7,10.5-10.5S17.8,1.5,12,1.5Zm4.28,13.62c.29.33.29.83-.02,1.15-.32.3-.81.31-1.14.02l-3.12-2.77-3.12,2.77c-.33.29-.83.29-1.14-.02-.3-.32-.31-.82-.02-1.15l2.77-3.12-2.77-3.12c-.29-.33-.29-.83.02-1.14.32-.3.81-.31,1.14-.02l3.12,2.77,3.12-2.77c.32-.29.83-.28,1.14.02.3.32.31.81.02,1.14l-2.77,3.12,2.77,3.12Z',
            );
        }
        // And put it in the center aligned container
        this.renderer.appendChild(svgIcon, path);
        this.renderer.appendChild(contentContainer1, svgIcon);

        // Create another container to put the title and text in
        const contentContainer2 = this.renderer.createElement('div');
        this.renderer.addClass(contentContainer2, 'toast-content-container2');
        // Create a span for the title and the text and put this in this container
        const titleEl = this.renderer.createElement('span');
        const titleText = this.renderer.createText(title);
        this.renderer.appendChild(titleEl, titleText);
        const message = this.renderer.createElement('span');
        this.renderer.addClass(message, 'mat-caption');
        message.innerHTML = text;
        this.renderer.appendChild(contentContainer2, titleEl);
        this.renderer.appendChild(contentContainer2, message);

        // Add both the SVG container as the text container to the main content container
        this.renderer.appendChild(contentContainer, contentContainer1);
        this.renderer.appendChild(contentContainer, contentContainer2);

        // Add the content container to the toast
        this.renderer.appendChild(toast, contentContainer);

        // Create a close button? Which is nothing more then a 'x' character
        if (options.showToastCloseBtn) {
            const closeBtn = this.renderer.createElement('span');
            this.renderer.addClass(closeBtn, 'toast-close-btn');
            const closeText = this.renderer.createText('×');
            this.renderer.appendChild(closeBtn, closeText);

            this.renderer.listen(closeBtn, 'click', () => {
                this.renderer.removeClass(toast, 'toast-fade-in');
                this.renderer.addClass(toast, 'toast-fade-out');
                setTimeout(() => {
                    this.renderer.removeChild(container, toast);
                }, 500);
            });

            this.renderer.appendChild(toast, closeBtn);
        }

        // Finally add the toast to the main container
        this.renderer.appendChild(container, toast);

        // Timeout to trigger the fade-in animation
        setTimeout(() => {
            this.renderer.addClass(toast, 'toast-fade-in');
        }, 10);

        if (options.autoClose) {
            setTimeout(() => {
                this.renderer.removeClass(toast, 'toast-fade-in');
                this.renderer.addClass(toast, 'toast-fade-out');
                setTimeout(() => {
                    this.renderer.removeChild(container, toast);
                }, 500);
            }, options.timeOut);
        }
    }
}

/**
 * Options to configure the Toast:
 * - autoClose? : close the toast default when timed out
 * - timeOut? : auto close after 3000ms
 * - showToastCloseBtn? : also show a close button (when clicked closes the toast)
 * - position? : where to show the toast (default at top-right)
 */
export class ToastOptions {
    autoClose?: boolean = true;
    timeOut?: number = 3500;
    showToastCloseBtn?: boolean = false;
    position?: ToastPositionType = 'top-right';
}

export type ToastType = 'success' | 'warning' | 'info' | 'error';
export type ToastPositionType =
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'full-bottom'
    | 'full-top';
