import { CommonModule } from '@angular/common';
import { Component, inject, model, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldTree, form, FormField, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { ImageForm } from '../../shared/components/image-form/image-form';
import { editorColorPresets, editorToolbar } from '../../shared/helpers/ngx-editor';
import { Chapter, chapterInitialState, chapterSchema } from '../../shared/models/chapter';
import { objectStatus } from '../../shared/models/status';
import { ChapterTitleInfo } from './chapter-title-info/chapter-title-info';

@Component({
    selector: 'chapters-form',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatDividerModule,
        MatExpansionModule,
        CommonModule,
        MatInputModule,
        NgxEditorModule,
        FormsModule,
        FormField,
        ImageForm,
        MatSlideToggleModule,
    ],
    templateUrl: './chapters-form.html',
})
export class ChaptersForm implements OnInit, OnDestroy {
    // The chapters as retrieved from the parent article form
    chapters = model.required<FieldTree<Chapter[]>>();

    // The chapter form, for handling changes to 1 chapter
    chapterModel = signal<Chapter>(chapterInitialState);
    chapterForm = form(this.chapterModel, chapterSchema);

    // Switch between chapter list view and chapter form
    isForm = signal<boolean>(false);

    /********************
     * RICH TEXT EDITOR *
     ********************/

    toolbar = editorToolbar;
    colorPresets = editorColorPresets;
    editor!: Editor;
    content = '';
    // For controlling the state of the content, which is required => minLength = 1
    editorErrorMessage = signal<string>('');

    // Services
    readonly dialog = inject(MatDialog);

    ngOnInit(): void {
        // No chapters created yet => show the form
        if (this.chapters()().value().length === 0) this.toggle();

        this.editor = new Editor();
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    toggle() {
        // If opening the form, make sure it is reset
        if (!this.isForm()) this.chapterForm().reset();
        this.isForm.update((isForm) => !isForm);
    }

    /**
     * On every change in the rich text editor:
     * - Count the actual characters, not the enrichments
     * - Reset the editor content to an empty string when the count === 0 => remove remaining tags.
     * - Update the form
     */
    updateChapterForm() {
        const count = this.content.replace(/<[^>]*>/g, '').length;
        if (count === 0 && this.content.length > 0) {
            // content has been entered and then deleted => create an error message
            this.editorErrorMessage.set('A chapter must either have text or an image');
            this.content = '';
        } else this.editorErrorMessage.set('');

        this.chapterModel.update((chapter) => ({ ...chapter, text: this.content }));
    }

    isEmpty(): boolean {
        let count = 0;
        this.chapters()()
            .value()
            .forEach((chapter) => {
                if (chapter.status === 3) count++;
            });
        return this.chapters()().value().length === 0 || this.chapters()().value().length === count
            ? true
            : false;
    }

    /****************
     * USER ACTIONS *
     ****************/

    /**
     * Explaining mightbe confusion UX: why a required title when possible not to show it?
     */
    openInfoDialog() {
        this.dialog.open(ChapterTitleInfo, {
            enterAnimationDuration: '400ms',
            exitAnimationDuration: '250ms',
        });
    }

    /**
     * Open the form with a new initial state for the chapter, able to create a new chapter
     * to be added to the article.
     */
    createNew() {
        this.chapterModel.set(chapterInitialState);
        this.content = '';
        this.toggle();
    }

    /**
     * Open an existing chapter from the list of chapters to be editted in the form.
     */
    open(index: number) {
        const chapter = this.chapters()().value()[index];
        if (chapter) {
            this.chapterModel.set(chapter);
            if (chapter.text) this.content = chapter.text;
            else this.content = '';
        }
        this.toggle();
    }

    /**
     * Add or change a chapter from the list
     */
    submitForm() {
        submit(this.chapterForm, async () => {
            const chapter = this.chapterModel();
            if (chapter.order) this.updateChapter(chapter);
            else this.insertChapter(chapter);
        });
    }

    /**
     * status = new
     * set article FK in chapter
     * assign chapter the next highest order number
     * add to the list of chapters
     * update the article form
     *
     * @param chapter the newly created chapter to be added to the article.
     */
    private insertChapter(chapter: Chapter) {
        chapter.status = objectStatus.New;

        let count = 0;
        this.chapters()()
            .value()
            .forEach((chapter) => {
                if (chapter.order > count) count = chapter.order;
            });
        chapter.order = count + 1;

        const chapters = [...this.chapters()().value(), chapter];
        this.chapters()().value.update(() => chapters);
    }

    private updateChapter(chapter: Chapter) {
        // Existing chapter? Leave new chapters marked as new
        if (chapter.status === objectStatus.Unchanged) chapter.status = objectStatus.Updated;
        // Chapter from the list => order number set => find by order number
        const index = this.chapters()()
            .value()
            .findIndex((item) => item.order === chapter.order);
        const before = this.chapters()().value().slice(0, index);
        const after = this.chapters()()
            .value()
            .slice(index + 1);
        (before.push(chapter), before.push(...after));
        this.chapters()().value.update(() => before);
    }

    /**
     * Here deletion is not an actual deletion, just mark the status as 'to be deleted'.
     * Once at the service, the insert and update will 'know' not to do anything with
     * chapters with no id and marked this way.
     */
    deleteChapter() {
        const index = this.chapters()()
            .value()
            .findIndex((item) => item.order === this.chapterModel().order);
        const chapter = this.chapters()().value()[index];
        chapter.status = objectStatus.ToBeDeleted;
        const before = this.chapters()().value().slice(0, index);
        const after = this.chapters()()
            .value()
            .slice(index + 1);
        (before.push(chapter), before.push(...after));
        this.chapters()().value.update(() => before);
    }
}
