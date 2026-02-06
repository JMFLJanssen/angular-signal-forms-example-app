import { Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

/**
 * Reusable component for showing a form fields label and its
 * possible errors set in the forms schema validation rules.
 */

@Component({
    selector: 'form-error',
    imports: [MatIconModule, MatInputModule],
    templateUrl: './form-error.html',
})
export class FormError<T> {
    readonly fieldRef = input.required<FieldTree<T>>();
    readonly title = input.required<string>();
}
