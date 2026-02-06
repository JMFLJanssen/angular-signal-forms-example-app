import { maxLength, required, schema, validate } from '@angular/forms/signals';
import { Image, imageInitialState } from './image';
import { objectStatus } from './status';

export interface ChapterItem {
    // Firebase auto generated unique string id
    id: string;

    // The article the chapter belongs to
    article: string;

    // The mandatory title of the chapter
    title: string;

    // On creation of multiple chapters at once, the order must be kept
    order: number;

    // A status used to keep the list of chapters in check when creating/updating that list.
    status: objectStatus;
}

export interface Chapter extends ChapterItem {
    // Indicate whether to use the chapter's title in the article
    showTitle: boolean;

    // The, optional, textual content of the chapter (as rich text)
    text: string;

    // The, optional, image of the chapter
    image: Image;

    // The caption beneath the image
    imageCaption: string;
}

export const chapterInitialState: Chapter = {
    id: '',
    article: '',
    title: '',
    order: 0,
    status: objectStatus.Unchanged,
    showTitle: true,
    text: '',
    image: imageInitialState,
    imageCaption: '',
};

/**
 * Validation rules:
 * - title = required with a max of 50 characters
 * - either the chapter should have text or an image
 * - if provided the caption of an image can be no more then 100 characters.
 */
export const chapterSchema = schema<Chapter>((schemaPath) => {
    required(schemaPath.title, { message: 'A chapter must have a title.' });
    maxLength(schemaPath.title, 50, { message: 'The title can be no more then 50 characters.' });
    validate(schemaPath.text, ({ value, valueOf }) => {
        const text = value();
        const imageUrl = valueOf(schemaPath.image.imageUrl);
        if (!text && !imageUrl)
            return {
                kind: 'at-least-one',
                message: 'A chapter should have either text or an image.',
            };
        return undefined;
    });
    validate(schemaPath.image.imageUrl, ({ value, valueOf }) => {
        const imageUrl = value();
        const text = valueOf(schemaPath.text);
        if (!text && !imageUrl)
            return {
                kind: 'at-least-one',
                message: 'A chapter should have either an image or text.',
            };
        return undefined;
    });
    maxLength(schemaPath.imageCaption, 100, {
        message: 'The caption of an image can be no more then 100 characters.',
    });
});
