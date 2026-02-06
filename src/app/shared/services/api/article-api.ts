import { inject, Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    orderBy,
    query,
    QueryDocumentSnapshot,
    updateDoc,
} from '@angular/fire/firestore';
import { Article, ArticleItem } from '../../models/article';

/**
 * CRUD FIREBASE implementation for Article objects.
 */
@Injectable({
    providedIn: 'root',
})
export class ArticleApi {
    // The name of the collection where the data is stored in
    private collection: string = 'articles';

    // The 'connection' to the Firestore database
    private db: Firestore = inject(Firestore);

    /**********
     * Create *
     **********/

    /**
     * @param article the information of the to be created article.
     * @returns the newly created Article object including its generated database ID.
     */
    async create(article: Article): Promise<Article> {
        await addDoc(collection(this.db, this.collection), {
            title: article.title,
            excerpt: article.excerpt,
            updateDate: new Date(),
            categoryID: article.category,
            status: article.status,
            creationDate: new Date(),
            text: article.text,
            imageUrl: article.image.imageUrl,
        }).then((doc) => {
            article.id = doc.id;
        });
        return article;
    }

    /********
     * Read *
     ********/

    /**
     * @returns a list of all known articles
     */
    async readAll(): Promise<ArticleItem[]> {
        const article: ArticleItem[] = [];
        const q = query(collection(this.db, this.collection), orderBy('updateDate', 'desc'));
        await getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                article.push(this.convertArticleItemFromDB(doc));
            });
        });
        return article;
    }

    /**
     * @param doc the data as read from the Firestore document
     * @returns a ArticleItem object which the front-end can handle
     */
    private convertArticleItemFromDB(doc: QueryDocumentSnapshot): ArticleItem {
        const article: ArticleItem = {
            id: doc.id,
            title: doc.get('title'),
            excerpt: doc.get('excerpt'),
            updateDate: doc.get('updateDate').toDate(),
            category: doc.get('categoryID'),
            image: {
                imageUrl: doc.get('imageUrl'),
                imageFile: null,
            },
            status: doc.get('status'),
        };
        return article;
    }

    /**
     * @returns a 'full' Article object matching the id
     */
    async readById(id: string): Promise<Article> {
        const docRef = doc(this.db, this.collection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return this.convertArticleFromDB(docSnap);
        } else {
            return {} as Article; // Document does not exist
        }
    }

    /**
     * @param doc the data as read from the Firestore document
     * @returns a Article object which the front-end can handle
     */
    private convertArticleFromDB(doc: QueryDocumentSnapshot): Article {
        const article: Article = {
            id: doc.id,
            title: doc.get('title'),
            excerpt: doc.get('excerpt'),
            updateDate: doc.get('updateDate').toDate(),
            category: doc.get('categoryID'),
            status: doc.get('status'),
            creationDate: doc.get('creationDate').toDate(),
            text: doc.get('text'),
            image: {
                imageUrl: doc.get('imageUrl'),
                imageFile: null,
            },
            chapters: [],
        };
        return article;
    }

    /**********
     * Update *
     **********/

    async update(article: Article) {
        const newsRef = doc(this.db, this.collection, article.id);
        await updateDoc(newsRef, {
            title: article.title,
            excerpt: article.excerpt,
            updatedAt: new Date(),
            categoryID: article.category,
            status: article.status,
            text: article.text,
            imageUrl: article.image.imageUrl,
        });
    }

    /**********
     * Delete *
     **********/

    /**
     * @param id the ID of the article to be deleted.
     */
    async delete(id: string) {
        const moduleRef = doc(this.db, this.collection, id);
        await deleteDoc(moduleRef);
    }
}
