import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NewsView } from '../../shared/components/news-view/news-view';
import { CategoryService } from '../../shared/services/category-service';
import { NewsService } from '../../shared/services/news-service';

/**
 * Component listing all news items with extra attention for the latest added/updated.
 */

@Component({
    selector: 'news-overview',
    imports: [
        MatChipsModule,
        MatListModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        NewsView,
    ],
    templateUrl: './news-overview.html',
})
export class NewsOverview {
    // Services
    categoryService: CategoryService = inject(CategoryService);
    newsService: NewsService = inject(NewsService);

    /**
     * @param id the ID of a category
     * @returns all news items assigned to that category
     */
    getNewsByCategory(id: string) {
        return this.newsService.newsItems().filter((news) => news.category === id);
    }

    /**
     * @param id the, ID of the, news item selected from the overview
     */
    selectNewsItem(id: string) {
        this.newsService.selectedID.set(id);
    }

    /**
     * Back to overview => make sure no news item is selected anymore.
     */
    back() {
        this.newsService.selectedID.set('');
    }

    /**
     * @param id the ID of a news item
     * @returns true if the news item is the latest news item updated, false otherwise.
     */
    isLatest(id: string) {
        return this.newsService.newsItems().findIndex((news) => news.id === id) === 0
            ? true
            : false;
    }
}
