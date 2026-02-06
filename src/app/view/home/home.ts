import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { ArticleService } from '../../shared/services/article-service';
import { NewsService } from '../../shared/services/news-service';

/**
 * Simple homepage component showing an overview of the latest news
 * and articles with both an option to go to the full overview of
 * all news and all articles.
 */
@Component({
    selector: 'home',
    imports: [MatButtonModule, MatIconModule, RouterLink, ArticleCard],
    templateUrl: './home.html',
})
export class Home {
    // Services
    newsService: NewsService = inject(NewsService);
    articleService: ArticleService = inject(ArticleService);

    selectNewsItem(id: string) {
        this.newsService.selectedID.set(id);
    }

    selectNone() {
        this.newsService.selectedID.set('');
        this.articleService.selectedID.set('');
    }
}
