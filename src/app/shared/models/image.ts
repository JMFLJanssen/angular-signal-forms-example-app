import { required, schema } from '@angular/forms/signals';

export interface Image {
    // The URL to the image as stored in the firestore image bucket,
    // or a temporary placeholder for the name when uploading a new image.
    imageUrl: string;

    // A placeholder for the new image to be uploaded.
    imageFile: File | null;
}

/**
 * The initial form state for a new image.
 */
export const imageInitialState: Image = {
    imageUrl: '',
    imageFile: null,
};

// Use this image schema when the image is required! For the cover image of an article
// this schema is applied in the article's schema. An article chapter has an optional image.
// There this schema isn't used.
export const imageSchema = schema<Image>((schemaPath) => {
    required(schemaPath.imageUrl, { message: 'Please upload an image. It is required.' });
});
