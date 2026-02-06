import { inject, Injectable, resource, signal } from '@angular/core';
import { createGuid } from '../helpers/guid';
import { Chapter, chapterInitialState, ChapterItem } from '../models/chapter';
import { ChapterApi } from './api/chapter-api';
import { ImageApi } from './api/image-api';

@Injectable({
    providedIn: 'root',
})
export class ChapterService {
    // The API services
    private api: ChapterApi = inject(ChapterApi);
    private imageApi: ImageApi = inject(ImageApi);

    // The list of all chapters, once retrieved from the databse is putten
    // into a signal, to be read by the templates.
    chapters = signal<ChapterItem[]>([]);

    // When selecting 1 specific full chapter the async resource is
    // triggered by setting a signal as input parameter for this read
    selectedID = signal<string>('');

    // Its result is then put in an output signal ready to be read by the template
    chapter = signal<Chapter>(chapterInitialState);

    // When selected an article either for viewing or editing, its chapters should be loaded
    selectedArticleID = signal<string>('');

    // The list of all chapters belonging to that article
    articleChapters = signal<Chapter[]>([]);

    /**********
     * Create *
     **********/

    /**
     * Insert a new chapter into the database, requires handling 2 async insert one after the other:
     * 1. Insertion of the uploaded image. This will create a URL which is put into the Chapter object.
     * 2. Insertion of the Chapter object itself.
     */
    async create(chapter: Chapter) {
        // A article chapter doesn't need to have an image!
        if (
            chapter.image.imageUrl &&
            chapter.image.imageUrl.startsWith('data:image') &&
            chapter.image.imageFile
        ) {
            // 1. Image
            const guid = createGuid();
            const path = `images/articles/${chapter.article}/${guid}`;
            const url = await this.imageApi.uploadImage(chapter.image.imageFile!, path);
            chapter.image.imageUrl = url;
        }
        // 2. Chapter
        await this.api.create(chapter);
    }

    /********
     * Read *
     ********/

    allResource = resource({
        loader: async ({}) => {
            const response = await this.api.readAll();
            this.chapters.set(response);
        },
    });

    articleResource = resource({
        params: () => ({ articleId: this.selectedArticleID() }),
        loader: async ({ params }) => {
            const response = await this.api.readByArticle(params.articleId);
            this.articleChapters.set(response);
        },
    });

    chapterResource = resource({
        params: () => ({ chapterId: this.selectedID() }),
        loader: async ({ params }) => {
            const response = await this.api.readById(params.chapterId);
            this.chapter.set(response);
        },
    });

    /**********
     * Update *
     **********/

    /**
     * Updating an existing chapter, requires handling 2 async updates one after the other:
     * 1. Update of the uploaded image. If there is a new image uploaded, delete the existing and insert a new image.
     * 2. Updating of the Chapter object itself, with the new image URL
     */
    async update(chapter: Chapter) {
        // 1. new image uploaded?
        if (
            chapter.image.imageUrl &&
            chapter.image.imageUrl.startsWith('data:image') &&
            chapter.image.imageFile
        ) {
            // Get the old url and delete the old image
            const oldImageUrl = this.chapter()!.image.imageUrl;
            if (oldImageUrl) await this.imageApi.deleteImage(oldImageUrl);
            // Insert the newly uploaded image
            const guid = createGuid();
            const path = `images/articles/${chapter.article}/${guid}`;
            const url = await this.imageApi.uploadImage(chapter.image.imageFile!, path);
            chapter.image.imageUrl = url;
        }
        // 2. Save the chapter
        await this.api.update(chapter);
    }

    /**********
     * Delete *
     **********/

    /**
     * Delete an existing chapter from the database
     */
    async delete(chapter: Chapter) {
        // Delete the image of the article
        if (chapter.image.imageUrl) await this.imageApi.deleteImage(chapter.image.imageUrl);
        // Delete the article
        await this.api.delete(chapter.id);
    }
}
