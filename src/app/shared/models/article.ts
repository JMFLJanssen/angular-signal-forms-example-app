import { apply, applyEach, maxLength, minLength, required, schema } from '@angular/forms/signals';
import { Chapter, chapterSchema } from './chapter';
import { Image, imageInitialState, imageSchema } from './image';
import { News, NewsItem } from './news';
import { status } from './status';

/**
 * Used to represent an article and derived from a news item => plus the
 * addition of a mandatory cover image and optional chapters.
 */

export interface ArticleItem extends NewsItem {
    image: Image;
}

export interface Article extends ArticleItem, News {
    chapters: Chapter[];
}

export const articleInitialState: Article = {
    id: '',
    title: '',
    excerpt: '',
    updateDate: new Date(),
    category: '',
    status: status.Concept,
    creationDate: new Date(),
    text: '',
    image: imageInitialState,
    chapters: [],
};

// Implementation of the business rules set for an article
export const articleSchema = schema<Article>((schemaPath) => {
    required(schemaPath.title, { message: 'An article must have a title.' });
    minLength(schemaPath.title, 5, {
        message: 'The title of an article has a length between 5 and 50 characters',
    });
    maxLength(schemaPath.title, 50, {
        message: 'The title of an article has a length between 5 and 50 characters',
    });
    required(schemaPath.excerpt, { message: 'An article must have an excerpt.' });
    minLength(schemaPath.excerpt, 25, {
        message: 'The excerpt of an article is between 25 and 150 characters of length.',
    });
    maxLength(schemaPath.excerpt, 200, {
        message: 'The excerpt of an article is between 25 and 150 characters of length.',
    });
    required(schemaPath.category, { message: 'Each article must be assigned to a category.' });

    // Although the text is 'managed' through a rich text editor, the form can at least check
    // its required state, keeping the form invalid if nothing is provided
    required(schemaPath.text, { message: 'An article always has some content.' });

    // apply child schema for the image
    apply(schemaPath.image, imageSchema);

    // Chapter are optional, but if added they should match their validation rules
    applyEach(schemaPath.chapters, chapterSchema);
});
