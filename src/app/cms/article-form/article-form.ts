import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { ArticleView } from '../../shared/components/article-view/article-view';
import { FormError } from '../../shared/components/form-error/form-error';
import { ImageForm } from '../../shared/components/image-form/image-form';
import { editorColorPresets, editorToolbar } from '../../shared/helpers/ngx-editor';
import { Article, articleInitialState, articleSchema } from '../../shared/models/article';
import { formStatus } from '../../shared/models/status';
import { ArticleService } from '../../shared/services/article-service';
import { CategoryService } from '../../shared/services/category-service';
import { ChapterService } from '../../shared/services/chapter-service';
import { ChaptersForm } from '../chapters-form/chapters-form';

export type ArticleFormPart = 'CONTENT' | 'IMAGE' | 'CHAPTERS' | 'CARD' | 'PREVIEW';

@Component({
    selector: 'article-form',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatDividerModule,
        CommonModule,
        RouterLink,
        MatInputModule,
        MatSelectModule,
        NgxEditorModule,
        FormsModule,
        FormField,
        FormError,
        ImageForm,
        ArticleCard,
        ArticleView,
        ChaptersForm,
    ],
    templateUrl: './article-form.html',
})
export class ArticleForm implements OnInit, OnDestroy {
    // Create the field structure that connects our data to the form
    articleModel = signal<Article>(articleInitialState);
    // Use the article schema with the form
    protected readonly articleForm = form(this.articleModel, articleSchema);

    // Which part of the form to view?
    part: ArticleFormPart = 'CONTENT';

    // The form status of the different parts as updatable signal array. This will provide feedback
    // to the user. It will inform the user on which part of the form there is still an error.
    status = signal<formStatus[]>([formStatus.New, formStatus.New]);

    // The rich text editor for the main text part of the article
    toolbar = editorToolbar;
    colorPresets = editorColorPresets;
    editor!: Editor;
    editorContent = '';
    // For controlling the state of the content, which is required => minLength = 1
    characterCount: number = 0;
    editorErrorMessage = signal<string>('');

    // Services
    articleService: ArticleService = inject(ArticleService);
    categoryService: CategoryService = inject(CategoryService);
    chapterService: ChapterService = inject(ChapterService);

    // Create the form for a new article or for editing an existing one?
    ngOnInit(): void {
        this.editor = new Editor();
        if (this.articleService.selectedID()) {
            const article = this.articleService.article();
            // Any chapters to load for this article?
            article.chapters = this.chapterService.articleChapters();
            this.articleModel.set(article);
            this.editorContent = this.articleModel().text;
        }
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    /**
     * On every change in the rich text editor:
     * - Count the actual characters, not the enrichments
     * - Reset the editor content to an empty string when the count === 0 => remove remaining tags.
     * - Update the form
     */
    updateNewsForm() {
        const count = this.editorContent.replace(/<[^>]*>/g, '').length;
        if (count === 0 && this.editorContent.length > 0) {
            // content has been entered and then deleted => create an error message
            this.editorErrorMessage.set('An article item must have some content.');
            this.editorContent = '';
        } else this.editorErrorMessage.set('');

        this.articleModel.update((article) => ({ ...article, text: this.editorContent }));
        this.characterCount = count;
    }

    /****************
     * USER ACTIONS *
     ****************/

    /**
     * On select of the left list, show a part of the form. This is done to cut up the form
     * not only into logical parts but also in smaller better managable parts.
     *
     * @param part the part of the form shown to the user
     */
    setViewPart(part: ArticleFormPart) {
        this.checkValidity(this.part);
        this.part = part;
    }

    private checkValidity(part: ArticleFormPart) {
        if (part === 'CONTENT') {
            // Content part
            let contentValidity = true;
            if (this.articleForm.category().invalid()) {
                this.articleForm.category().markAsTouched();
                contentValidity = false;
            }
            if (this.articleForm.title().invalid()) {
                this.articleForm.title().markAsTouched();
                contentValidity = false;
            }
            if (this.articleForm.excerpt().invalid()) {
                this.articleForm.excerpt().markAsTouched();
                contentValidity = false;
            }
            if (this.articleForm.text().invalid()) {
                this.articleForm.text().markAsTouched();
                this.editorErrorMessage.set('An article item must have some content.');
                contentValidity = false;
            }

            // Update the form status for the content part: informing the user whether this part is valid or not
            if (contentValidity)
                this.status.update((prev) => [
                    ...prev.slice(0, 0),
                    formStatus.Valid,
                    ...prev.slice(1),
                ]);
            else
                this.status.update((prev) => [
                    ...prev.slice(0, 0),
                    formStatus.Invalid,
                    ...prev.slice(1),
                ]);
        }

        if (part === 'IMAGE') {
            // Image part
            let imageValidity = true;
            if (this.articleForm.image().invalid()) {
                this.articleForm.image.imageUrl().markAsTouched();
                imageValidity = false;
            }
            if (imageValidity)
                this.status.update((prev) => [
                    ...prev.slice(0, 1),
                    formStatus.Valid,
                    ...prev.slice(2),
                ]);
            else
                this.status.update((prev) => [
                    ...prev.slice(0, 1),
                    formStatus.Invalid,
                    ...prev.slice(2),
                ]);
        }

        if (part === 'CHAPTERS') {
            // always valid: the are optional and can only be added to the article
            // if their form is valid.
            this.status.update((prev) => [...prev.slice(0, 2), formStatus.Valid, ...prev.slice(3)]);
        }
    }

    submitForm() {
        submit(this.articleForm, async () => {
            const article = this.articleModel();
            if (article.id) this.articleService.update(article);
            else this.articleService.create(article);
        });
    }

    delete() {
        this.articleService.delete(this.articleModel());
    }

    cancel() {
        if (!this.articleService.selectedID() && this.articleService.articles().length > 0)
            this.articleService.selectedID.set(this.articleService.articles()[0].id);
        // Make sure to reload the previously opened article in order to undo any changes that
        // might have been done on the form.
        else this.articleService.articleResource.reload();
    }
}
