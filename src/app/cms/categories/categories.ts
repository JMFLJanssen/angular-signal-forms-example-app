import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { FormError } from '../../shared/components/form-error/form-error';
import { Category, categorySchema, catetoryInitialState } from '../../shared/models/category';
import { CategoryService } from '../../shared/services/category-service';

@Component({
    selector: 'categories',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        FormError,
        FormField,
        MatListModule,
        MatDividerModule,
    ],
    templateUrl: './categories.html',
})
export class Categories {
    // Switch between view and form
    isForm = signal<boolean>(false);

    // The category service for this form
    categoryService: CategoryService = inject(CategoryService);

    // The category model & form
    private categoryModel = signal<Category>(catetoryInitialState);
    categoryForm = form(this.categoryModel, categorySchema);

    private toggle() {
        this.isForm.update((isForm) => !isForm);
    }

    canDelete() {
        return this.categoryService.canDelete(this.categoryModel().id);
    }

    /****************
     * USER ACTIONS *
     ****************/

    /**
     * Click on + button to create a form with an initial state model
     */
    add() {
        this.categoryModel.set(catetoryInitialState);
        this.toggle();
    }

    /**
     * Cancel add/edit => go back to view
     */
    cancel() {
        if (!this.categoryModel().id && this.categoryService.categories().length > 0) {
            // load the first category of the list to show in the view
            this.categoryModel.set(this.categoryService.categories()[0]);
        }
        this.toggle();
    }

    /**
     * Change from view to form.
     */
    edit() {
        if (!this.categoryModel().id && this.categoryService.categories().length > 0)
            this.categoryModel.set(this.categoryService.categories()[0]);
        this.toggle();
    }

    /**
     * @param id the id of the categpry as selected from the list of existing
     */
    select(id: string) {
        this.categoryModel.set(
            this.categoryService.categories().find((category) => category.id === id)!,
        );
    }

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.categoryForm, async () => {
            const category = this.categoryModel();
            if (category.id) this.categoryService.update(category);
            else this.categoryService.create(category);
        });
        this.categoryModel.set(catetoryInitialState);
        this.categoryForm().reset();
        this.toggle();
    }

    delete() {
        this.categoryService.delete(this.categoryModel().id);
        this.categoryModel.set(catetoryInitialState);
        this.categoryForm().reset();
    }
}
