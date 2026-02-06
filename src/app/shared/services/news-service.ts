import { inject, Injectable, resource, signal } from '@angular/core';
import { News, newsInitialState, NewsItem } from '../models/news';
import { NewsApi } from './api/news-api';
import { ToastrService } from './toastr-service';

@Injectable({
    providedIn: 'root',
})
export class NewsService {
    // The API service
    private api: NewsApi = inject(NewsApi);

    // Other services
    private toastrService: ToastrService = inject(ToastrService);

    // The list of all news items, once retrieved from the databse is putten
    // into a signal, to be read by the templates.
    newsItems = signal<NewsItem[]>([]);

    // When selecting 1 specific full news item the async resource is
    // triggered by setting a signal as input parameter for this read
    selectedID = signal<string>('');

    // Its result is then put in an output signal ready to be read by the template
    news = signal<News>(newsInitialState);

    /**********
     * Create *
     **********/

    /**
     * Insert a new news item into the database.
     *
     * @success update the signal keeping track of all news items
     * @error notify the user something went wrong
     */
    create(news: News) {
        this.api
            .create(news)
            .then((newNews) => {
                // The newsItems signal contains NewsItem object which are small. The main content is in the rich text.
                // A db reload will therefor not be that have on the system (and it's only for the admin doing it!).
                this.allResource.reload();
                this.selectedID.set(newNews.id);
                this.newsResource.reload();
            })
            .catch(() => {
                const title = 'Creation error';
                const message =
                    'An unexpected error occurred during creation of the new news item. Please try again later.';
                this.toastrService.showToast(title, message, 'error');
            });
    }

    /********
     * Read *
     ********/

    allResource = resource({
        loader: async ({}) => {
            const response = await this.api.readAll();
            this.newsItems.set(response);
            if (!this.selectedID() && response.length > 0) {
                this.selectedID.set(response[0].id);
                this.newsResource.reload();
            }
        },
    });

    newsResource = resource({
        params: () => ({ newsId: this.selectedID() }),
        loader: async ({ params }) => {
            const response = await this.api.readById(params.newsId);
            this.news.set(response);
        },
    });

    /**********
     * Update *
     **********/

    /**
     * Update an existing news items in the database.
     *
     * @success update the signal keeping track of all news
     * @error notify the user something went wrong
     */
    update(news: News) {
        this.api
            .update(news)
            .then(() => {
                this.allResource.reload();
                this.newsResource.reload();
            })
            .catch(() => {
                const title = 'Update error';
                const message =
                    'An unexpected error occurred during news update. Please try again later.';
                this.toastrService.showToast(title, message, 'error');
            });
    }

    /**********
     * Delete *
     **********/

    /**
     * Delete an existing news item from the database
     *
     * @success update the signal keeping track of all news => filter out the deleted item
     * @error notify the user something went wrong
     */
    delete(id: string) {
        this.api
            .delete(id)
            .then(() => {
                this.allResource.reload();
                if (this.newsItems() && this.newsItems().length > 0) {
                    this.selectedID.set(this.newsItems()[0].id);
                    this.newsResource.reload();
                }
            })
            .catch((e) => {
                const title = 'Deletion error';
                const message =
                    'An unexpected error occurred during deletion of the news item. Please try again later.';
                this.toastrService.showToast(title, message, 'error');
            });
    }
}
