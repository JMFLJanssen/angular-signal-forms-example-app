import { Routes } from '@angular/router';
import { ArticleForm } from './cms/article-form/article-form';
import { Articles } from './cms/articles/articles';
import { Categories } from './cms/categories/categories';
import { NewsItems } from './cms/news-items/news-items';
import { ArticleOverview } from './view/article-overview/article-overview';
import { Home } from './view/home/home';
import { NewsOverview } from './view/news-overview/news-overview';

export const routes: Routes = [
    /********
     * VIEW *
     ********/

    { path: 'home', component: Home },
    { path: 'articles', component: ArticleOverview },
    { path: 'news', component: NewsOverview },

    /*******
     * CMS *
     *******/

    { path: 'cms/categories', component: Categories },
    { path: 'cms/news', component: NewsItems },
    { path: 'cms/articles', component: Articles },
    { path: 'cms/article/edit', component: ArticleForm },

    /***********
     * DEFAULT *
     ***********/

    { path: '**', redirectTo: 'home' },
];
