import { Component, model, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Image } from '../../models/image';

/**
 * Reusable image form component taking in a Image child form from the main parent form.
 * It allowed users to upload an image, showing a default image to start with. And to 'delete'
 * the uploaded image when the schema doesn't specify it is required.
 */

@Component({
    selector: 'image-form',
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './image-form.html',
})
export class ImageForm {
    // The child form for the image
    image = model.required<FieldTree<Image>>();

    // the URL of the image, or a default src when article doesn't have an image
    imageSrc = signal<any>('/images/placeholder.jpg');

    // A container for the uploaded image
    private uploadedFile!: File;

    /****************************
     * IMAGE UPLOAD FOR PREVIEW *
     ****************************/

    onFileSelected($event: Event): void {
        const input = $event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            this.uploadedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageSrc.update(() => e.target?.result);

                // Image uploaded => inform the parent form
                this.image().imageUrl().value.set(this.imageSrc());
                this.image().imageFile().value.set(this.uploadedFile);
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Only possible (delete button only showing) when an image has been
     * uploaded and the form schema does not have the required validation
     * on the image.
     */
    delete() {
        this.image().imageUrl().value.set('');
        this.image().imageFile().value.set(null);
        this.imageSrc.set('/images/placeholder.jpg');
    }
}
