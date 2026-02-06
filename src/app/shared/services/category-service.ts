import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { Category } from '../models/category';
import { CategoryApi } from './api/category-api';
import { ToastrService } from './toastr-service';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    // The API service
    private api: CategoryApi = inject(CategoryApi);

    // Other services
    private toastrService: ToastrService = inject(ToastrService);

    // The list of all categories, once retrieved from the databse is putten
    // into a signal, to be read by the templates.
    categories = signal<Category[]>([]);

    /**********
     * Create *
     **********/

    /**
     * Insert a new category into the database.
     *
     * @success update the signal keeping track of all categories
     * @error notify the user something went wrong
     */
    create(category: Category) {
        /** DISABLED FOR DEMO PURPOSESE
        this.api
            .create(category)
            .then((newCategory) => {
                this.allResource.reload();
            })
            .catch(() => {
                const title = 'Creation error';
                const message =
                    'An unexpected error occurred during creation of the new category. Please try again later.';
                this.toastrService.showToast(title, message, 'error');
            });
        */
    }

    /********
     * Read *
     ********/

    allResource = resource({
        loader: async ({}) => {
            const response = await this.api.readAll();
            this.categories.set(response);
        },
    });

    allLoading = computed(() => this.allResource.status() === 'loading');

    /**********
     * Update *
     **********/

    /**
     * Update an existing category in the database.
     *
     * @success update the signal keeping track of all categories
     * @error notify the user something went wrong
     */
    update(category: Category) {
        /** DISABLED FOR DEMO PURPOSESE
        this.api
            .update(category)
            .then(() => {
                this.allResource.reload();
            })
            .catch(() => {
                const title = 'Update error';
                const message =
                    'An unexpected error occurred during category update. Please try again later.';
                this.toastrService.showToast(title, message, 'error');
            });
        */
    }

    /**********
     * Delete *
     **********/

    /**
     * A category can only be deleted if there are no news items or articles attached to it.
     *
     * @param id the id of the category for which has to be checked if it can be deleted.
     * @returns true if it is possible to delete the category, false otherwise
     */
    canDelete(id: string): boolean {
        // TODO: implementation after article service has been implemented
        return true;
    }

    /**
     * Delete an existing category from the database
     *
     * @success update the signal keeping track of all categories => filter out the deleted category
     * @error notify the user something went wrong
     */
    delete(id: string) {
        /** DISABLED FOR DEMO PURPOSESE
        this.api
            .delete(id)
            .then(() => {
                this.allResource.reload();
            })
            .catch((e) => {
                const title = 'Deletion error';
                const message =
                    'An unexpected error occurred during deletion of the category. Please try again later.';
                this.toastrService.showToast(title, message, 'error');
            });
        */
    }
}
