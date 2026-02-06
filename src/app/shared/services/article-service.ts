import { inject, Injectable, resource, signal } from '@angular/core';
import { createGuid } from '../helpers/guid';
import { Article, articleInitialState, ArticleItem } from '../models/article';
import { objectStatus } from '../models/status';
import { ArticleApi } from './api/article-api';
import { ImageApi } from './api/image-api';
import { ChapterService } from './chapter-service';
import { ToastrService } from './toastr-service';

@Injectable({
    providedIn: 'root',
})
export class ArticleService {
    // The API services
    private api: ArticleApi = inject(ArticleApi);
    private imageApi: ImageApi = inject(ImageApi);

    // Other services
    private chapterService: ChapterService = inject(ChapterService);
    private toastrService: ToastrService = inject(ToastrService);

    // The list of all articles, once retrieved from the databse is putten
    // into a signal, to be read by the templates.
    articles = signal<ArticleItem[]>([]);

    // When selecting 1 specific full article the async resource is
    // triggered by setting a signal as input parameter for this read
    selectedID = signal<string>('');

    // Its result is then put in an output signal ready to be read by the template
    article = signal<Article>(articleInitialState);

    /**********
     * Create *
     **********/

    /**
     * Insert a new article into the database, requires handling 2 async insert one after the other:
     * 1. Insertion of the uploaded image. This will create a URL which is put into the Article object.
     * 2. Insertion of the Article object itself.
     * 3. After the article has been assigned an ID, use this to create any chapter to be created
     *
     * @success update the signal keeping track of all articles & set the selected article to the newly created one.
     * @error notify the user something went wrong
     */
    create(article: Article) {
        /** DISABLED FOR DEMO PURPOSESE
        this.handleCreate(article)
            .then((newArticle) => {
                this.allResource.reload();
                this.selectedID.set(newArticle.id);
                this.articleResource.reload();
            })
            .catch((e) => {
                const title = 'Creation error';
                const message =
                    'An unexpected error occurred during creation of the new article. Please try again later.';
                this.toastrService.showToast(title, message, 'error');
            });
        */
    }

    /**
     * The consecutive async handling of image and article creation
     */
    private async handleCreate(article: Article): Promise<Article> {
        // 1. Image
        const guid = createGuid();
        const path = `images/articles/${guid}`;
        const url = await this.imageApi.uploadImage(article.image.imageFile!, path);
        article.image.imageUrl = url;
        // 2. Article
        article = await this.api.create(article);
        // 3. Create all articles marked as new!
        article.chapters.forEach(async (chapter) => {
            if (chapter.status === objectStatus.New) {
                chapter.article = article.id;
                await this.chapterService.create(chapter);
            }
        });
        // Once all chapters have been created, make sure the article chapters list is reloaded
        this.chapterService.selectedArticleID.set(article.id);
        this.chapterService.articleResource.reload();

        return article;
    }

    /********
     * Read *
     ********/

    allResource = resource({
        loader: async ({}) => {
            const response = await this.api.readAll();
            this.articles.set(response);
            if (!this.selectedID() && response.length > 0) {
                this.selectedID.set(response[0].id);
                this.articleResource.reload();
            }
        },
    });

    articleResource = resource({
        params: () => ({ articleId: this.selectedID() }),
        loader: async ({ params }) => {
            const response = await this.api.readById(params.articleId);
            // Once the article is loaded, make sure the chapters are loaded as well
            this.chapterService.selectedArticleID.set(response.id);
            this.chapterService.articleResource.reload();
            response.chapters = this.chapterService.articleChapters();
            this.article.set(response);
        },
    });

    /**********
     * Update *
     **********/

    /**
     * Updating an existing article, requires handling 2 async updates one after the other:
     * 1. Update of the uploaded image. If there is a new image uploaded, delete the existing and insert a new image.
     * 2. Updating of the Article object itself, with the new image URL
     * 3. Handle any changes/inserts/deletions of chapters of the article
     *
     * @success update the signal keeping track of all articles & reload the selected article as well.
     * @error notify the user something went wrong
     */
    update(article: Article) {
        /** DISABLED FOR DEMO PURPOSESE
        this.handleUpdate(article)
            .then(() => {
                this.allResource.reload();
                this.articleResource.reload();
            })
            .catch(() => {
                const title = 'Update error';
                const message =
                    'An unexpected error occurred during article update. Please try again later.';
                this.toastrService.showToast(title, message, 'error');
            });
        */
    }

    /**
     * The consecutive async handling of image and article update
     */
    private async handleUpdate(article: Article) {
        // 1. new image uploaded?
        if (article.image.imageUrl && article.image.imageUrl.startsWith('data:image') && article.image.imageFile) {
            // Get the old url and delete the old image
            const oldImageUrl = this.articles().find((article) => article.id === article.id)!.image.imageUrl;
            if (oldImageUrl) await this.imageApi.deleteImage(oldImageUrl);
            // Insert the newly uploaded image
            const guid = createGuid();
            const path = `images/articles/${guid}`;
            const url = await this.imageApi.uploadImage(article.image.imageFile!, path);
            article.image.imageUrl = url;
        }
        // 2. Handle changes to the chapters
        article.chapters.forEach(async (chapter) => {
            if (chapter.status === objectStatus.New) {
                chapter.article = article.id;
                await this.chapterService.create(chapter);
            } else if (chapter.status === objectStatus.Updated) await this.chapterService.update(chapter);
            else if (chapter.status === objectStatus.ToBeDeleted && chapter.id) await this.chapterService.delete(chapter);
        });
        // 3. Save the article
        await this.api.update(article);
    }

    /**********
     * Delete *
     **********/

    /**
     * Delete an existing article from the database, as well as its image and its chapters
     *
     * @success update the signal keeping track of all news => filter out the deleted item
     * @error notify the user something went wrong
     */
    delete(article: Article) {
        /** DISABLED FOR DEMO PURPOSESE
        this.handleDelete(article)
            .then(() => {
                this.allResource.reload();
                if (this.articles() && this.articles().length > 0) {
                    this.selectedID.set(this.articles()[0].id);
                    this.articleResource.reload();
                }
            })
            .catch(() => {
                const title = 'Deletion error';
                const message =
                    'An unexpected error occurred during deletion of the article. Please try again later.';
                this.toastrService.showToast(title, message, 'error');
            });
        */
    }

    private async handleDelete(article: Article) {
        // Delete the image of the article
        if (article.image.imageUrl) await this.imageApi.deleteImage(article.image.imageUrl);
        // Delete the chapters of the article
        article.chapters.forEach(async (chapter) => {
            this.chapterService.delete(chapter);
        });
        // Delete the article
        await this.api.delete(article.id);
    }
}
