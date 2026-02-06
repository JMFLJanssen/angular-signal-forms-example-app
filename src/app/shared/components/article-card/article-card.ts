import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ArticleItem } from '../../models/article';
import { ArticleService } from '../../services/article-service';

/**
 * On the homepage some articles are shown as cards. The title, excerpt
 * and image should entice the user to read the full article.
 */

@Component({
    selector: 'article-card',
    imports: [MatButtonModule, CommonModule, RouterLink],
    templateUrl: './article-card.html',
    styleUrl: './article-card.scss',
})
export class ArticleCard {
    // 2 ways of viewing an article: 1 in the app directly loaded from the database.
    // 2 as an article in change from the CMS. For the first the ID is enough input
    // for the second it ArticleItem object is needed
    articleId = input<string>();
    articleItem = input<ArticleItem>();

    // Services needed
    articleService: ArticleService = inject(ArticleService);

    /**
     * Loading from database: only the ID is provided as input parameter.
     *
     * @param id the id of the article
     * @returns the ArticleItem, containing all information needed for showing its card.
     */
    getArticleItem(id: string) {
        return this.articleService.articles().find((article) => article.id === id)!;
    }

    /**
     * Click on 'Read the full article' => load the full Article object (not just the ArticleItem).
     */
    loadArticle() {
        if (!this.articleId() && this.articleItem()!.id)
            this.articleService.selectedID.set(this.articleItem()!.id);
        else if (this.articleId()) this.articleService.selectedID.set(this.articleId()!);
    }
}
