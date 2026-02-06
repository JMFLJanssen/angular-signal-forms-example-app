import { maxLength, minLength, required, schema } from '@angular/forms/signals';
import { status } from './status';

/**
 * Used to represent a news item in this application. Where the NewsItem object
 * contains all information needed to list news items. The News object containing
 * the full information of a news item.
 */

export interface NewsItem {
    // Firebase auto generated unique string id
    id: string;

    // The title of the news
    title: string;

    // A short excerpt to entice the user to read the full news article
    excerpt: string;

    // The date when the news item was last updated
    updateDate: Date;

    // The category the news item is assigned to
    category: string;

    // Status Concept or Current. The first only visible in the CMS, not yet ready for the world
    status: status;
}

export interface News extends NewsItem {
    // The date when the news item was first created
    creationDate: Date;

    // The full news text, provided as rich text
    text: string;
}

export const newsInitialState: News = {
    id: '',
    title: '',
    excerpt: '',
    updateDate: new Date(),
    category: '',
    status: status.Concept,
    creationDate: new Date(),
    text: '',
};

// Implementation of the business rules set for a news item.
export const newsSchema = schema<News>((schemaPath) => {
    required(schemaPath.title, { message: 'A news item must have a title.' });
    minLength(schemaPath.title, 5, {
        message: 'The title of a news item has a length between 5 and 50 characters',
    });
    maxLength(schemaPath.title, 50, {
        message: 'The title of a news item has a length between 5 and 50 characters',
    });
    required(schemaPath.excerpt, { message: 'A news item must have an excerpt.' });
    minLength(schemaPath.excerpt, 25, {
        message: 'The excerpt of a news item is between 25 and 150 characters of length.',
    });
    maxLength(schemaPath.excerpt, 200, {
        message: 'The excerpt of a news item is between 25 and 150 characters of length.',
    });
    required(schemaPath.category, { message: 'Each news item must be assigned to a category.' });

    // Although the text is 'managed' through a rich text editor, the form can at least check
    // its required state, keeping the form invalid if nothing is provided
    required(schemaPath.text, { message: 'A news item always has some content.' });
});
