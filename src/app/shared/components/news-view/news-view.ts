import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { News } from '../../models/news';
import { CategoryService } from '../../services/category-service';
import { NewsService } from '../../services/news-service';

/**
 * Component for full view of a news item.
 */

@Component({
    selector: 'news-view',
    imports: [MatIconModule, CommonModule, MatChipsModule],
    templateUrl: './news-view.html',
})
export class NewsView {
    // 2 ways of viewing an news item: 1 in the app directly loaded from the database.
    // 2 as a news item in change from the CMS. For the first the ID is enough input
    // for the second it's the full model that's needed.
    newsId = input<string>();
    news = input<News>();

    // If the id is provided the template will show the news loaded through the service
    newsService: NewsService = inject(NewsService);
    private categoryService: CategoryService = inject(CategoryService);

    /**
     * Needed due to the nature of Firebase. Using a relational database this can
     * be solved with a query of view.
     *
     * @param id the FK of the category as stored in the news item
     * @returns the name of the category as stored in the categories table.
     */
    getCategory(id: string): string {
        const category = this.categoryService.categories().find((category) => category.id === id);
        return category ? category.name : '';
    }
}
