import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article-service';
import { CategoryService } from '../../services/category-service';
import { ChapterService } from '../../services/chapter-service';

/**
 * Component for full view of an article and its chapters.
 */

@Component({
    selector: 'article-view',
    imports: [MatChipsModule, CommonModule],
    templateUrl: './article-view.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleView {
    // 2 ways of viewing an article: 1 in the app directly loaded from the database.
    // 2 as an article in change from the CMS. For the first the ID is enough input
    // for the second it ArticleItem object is needed
    articleId = input<string>();
    article = input<Article>();

    // Services needed
    articleService: ArticleService = inject(ArticleService);
    private categoryService: CategoryService = inject(CategoryService);
    chapterService: ChapterService = inject(ChapterService);

    /**
     * Needed due to the nature of Firebase. Using a relational database this can
     * be solved with a query of view.
     *
     * @param id the FK of the category as stored in the article
     * @returns the name of the category as stored in the categories table.
     */
    getCategory(id: string) {
        const category = this.categoryService.categories().find((category) => category.id === id);
        return category ? category.name : '';
    }
}
