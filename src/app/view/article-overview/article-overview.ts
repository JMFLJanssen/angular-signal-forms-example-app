import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ArticleView } from '../../shared/components/article-view/article-view';
import { ArticleService } from '../../shared/services/article-service';
import { CategoryService } from '../../shared/services/category-service';

/**
 * Component listing all articles with extra attention for the latest added/updated.
 */

@Component({
    selector: 'article-overview',
    imports: [MatButtonModule, MatIconModule, ArticleView, MatChipsModule, MatListModule],
    templateUrl: './article-overview.html',
})
export class ArticleOverview {
    // Services
    categoryService: CategoryService = inject(CategoryService);
    articleService: ArticleService = inject(ArticleService);

    /**
     * @param id the ID of a category
     * @returns all articles assigned to that category
     */
    getArticlesByCategory(id: string) {
        return this.articleService
            .articles()
            .filter(
                (article) =>
                    article.category === id &&
                    article.id !== this.articleService.articles()[0].id &&
                    article.status === 1,
            );
    }

    /**
     * @param id the, ID of the, article selected from the overview
     */
    selectArticle(id: string) {
        this.articleService.selectedID.set(id);
    }

    /**
     * Back to overview => make sure no article is selected anymore.
     */
    back() {
        this.articleService.selectedID.set('');
    }

    getLatest() {
        return this.articleService.articles().filter((article) => article.status === 1)[0];
    }
}
