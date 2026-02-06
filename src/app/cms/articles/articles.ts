import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { ArticleView } from '../../shared/components/article-view/article-view';
import { ArticleService } from '../../shared/services/article-service';

@Component({
    selector: 'articles',
    imports: [MatButtonModule, MatIconModule, MatListModule, CommonModule, RouterLink, ArticleView],
    templateUrl: './articles.html',
})
export class Articles {
    // Services
    articleService: ArticleService = inject(ArticleService);

    /****************
     * USER ACTIONS *
     ****************/

    /**
     * Click on + button to create a form with an initial state model.
     */
    add() {
        this.articleService.selectedID.set('');
    }

    /**
     * @param id the id of the articles as selected from the list of existing
     */
    select(id: string) {
        this.articleService.selectedID.set(id);
    }
}
