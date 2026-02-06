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
import { Editor, NgxEditorModule } from 'ngx-editor';
import { FormError } from '../../shared/components/form-error/form-error';
import { NewsView } from '../../shared/components/news-view/news-view';
import { editorColorPresets, editorToolbar } from '../../shared/helpers/ngx-editor';
import { News, newsInitialState, newsSchema } from '../../shared/models/news';
import { CategoryService } from '../../shared/services/category-service';
import { NewsService } from '../../shared/services/news-service';

@Component({
    selector: 'news-items',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        FormError,
        FormField,
        MatListModule,
        MatDividerModule,
        NgxEditorModule,
        FormsModule,
        NewsView,
        MatSelectModule,
    ],
    templateUrl: './news-items.html',
})
export class NewsItems implements OnInit, OnDestroy {
    // Switch between news view and form
    isForm = signal<boolean>(false);

    // The News model & form
    newsModel = signal<News>(newsInitialState);
    protected readonly newsForm = form(this.newsModel, newsSchema);

    // The rich text editor
    toolbar = editorToolbar;
    colorPresets = editorColorPresets;
    editor!: Editor;
    editorContent = '';
    // For controlling the state of the content, which is required => minLength = 1 and
    // has a maxLangth of 1000 charachters
    characterCount: number = 0;
    maxCharactersAllowed: number = 1000;
    editorErrorMessage = signal<string>('');

    // Services
    newsService: NewsService = inject(NewsService);
    categoryService: CategoryService = inject(CategoryService);

    ngOnInit(): void {
        this.editor = new Editor();
        if (this.newsService.newsItems().length > 0)
            this.newsService.selectedID.set(this.newsService.newsItems()[0].id);
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    private toggle() {
        this.isForm.update((isForm) => !isForm);
    }

    /**
     * On every change in the rich text editor:
     * - Count the actual characters, not the enrichments
     * - Reset the editor content to an empty string when the count === 0 => remove remaining tags.
     * - Update the form
     * - If there is a maximum amount of characters allowed create an error message to inform the user when
     *   he has gone over and invalidate the form.
     */
    updateNewsForm() {
        const count = this.editorContent.replace(/<[^>]*>/g, '').length;
        if (count === 0 && this.editorContent.length > 0) {
            // content has been entered and then deleted => create an error message
            this.editorErrorMessage.set('A news item must have some content.');
            this.editorContent = '';
        } else if (count > this.maxCharactersAllowed)
            this.editorErrorMessage.set('A news item has a maximum of 1000 characters.');
        else this.editorErrorMessage.set('');

        this.newsModel.update((news) => ({ ...news, text: this.editorContent }));
        this.characterCount = count;
    }

    /****************
     * USER ACTIONS *
     ****************/

    /**
     * Click on + button to create a form with an initial state model and an
     * editor with no content
     */
    add() {
        this.newsModel.set(newsInitialState);
        this.editorContent = '';
        this.toggle();
    }

    /**
     * Cancel add/edit => go back to view
     */
    cancel() {
        if (!this.newsModel().id && this.newsService.newsItems().length > 0) {
            // load the first news item of the list to show in the view
            // this should be the full news article, not just the NewsItem object
            // from the signal list.
            this.newsModel.set(this.newsService.news());
        }
        this.toggle();
    }

    /**
     * Change from view to form. Load the content of the viewed news text
     * into the editor.
     */
    edit() {
        this.newsModel.set(this.newsService.news());
        this.editorContent = this.newsModel().text;
        this.toggle();
    }

    /**
     * @param id the id of the news items as selected from the list of existing
     */
    select(id: string) {
        this.newsService.selectedID.set(id);
    }

    submitForm() {
        submit(this.newsForm, async () => {
            const news = this.newsModel();
            if (news.id) this.newsService.update(news);
            else this.newsService.create(news);
        });
        this.newsModel.set(this.newsService.news());
        this.newsForm().reset();
        this.toggle();
    }

    delete() {
        this.newsService.delete(this.newsModel().id);
        this.newsForm().reset();
        this.toggle();
    }
}
