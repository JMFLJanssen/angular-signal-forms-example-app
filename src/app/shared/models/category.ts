import { maxLength, minLength, required, schema } from '@angular/forms/signals';

/**
 * Used to represent a category in the application, for both news items and articles.
 */
export interface Category {
    // Firebase auto generated unique string id
    id: string;

    // The name of the category
    name: string;
}

export const catetoryInitialState: Category = {
    id: '',
    name: '',
};

// Implementation of the business rules set for a category.
export const categorySchema = schema<Category>((schemaPath) => {
    required(schemaPath.name, { message: 'A category must have a name' });
    minLength(schemaPath.name, 5, {
        message: 'The name of a category has a length between 5 and 25 characters',
    });
    maxLength(schemaPath.name, 25, {
        message: 'The name of a category has a length between 5 and 25 characters',
    });
});
