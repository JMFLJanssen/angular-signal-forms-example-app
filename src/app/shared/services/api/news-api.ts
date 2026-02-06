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
import { News, NewsItem } from '../../models/news';

/**
 * CRUD FIREBASE implementation for News objects.
 */
@Injectable({
    providedIn: 'root',
})
export class NewsApi {
    // The name of the collection where the data is stored in
    private collection: string = 'news-items';

    // The 'connection' to the Firestore database
    private db: Firestore = inject(Firestore);

    /**********
     * Create *
     **********/

    /**
     * @param news the information of the to be creatednews item.
     * @returns the newly created News object including its generated database ID.
     */
    async create(news: News): Promise<News> {
        await addDoc(collection(this.db, this.collection), {
            title: news.title,
            excerpt: news.excerpt,
            updateDate: new Date(),
            categoryID: news.category,
            status: news.status,
            creationDate: new Date(),
            text: news.text,
        }).then((doc) => {
            news.id = doc.id;
        });
        return news;
    }

    /********
     * Read *
     ********/

    /**
     * @returns a list of all known news items
     */
    async readAll(): Promise<NewsItem[]> {
        const news: NewsItem[] = [];
        const q = query(collection(this.db, this.collection), orderBy('updateDate', 'desc'));
        await getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                news.push(this.convertNewsItemFromDB(doc));
            });
        });
        return news;
    }

    /**
     * @param doc the data as read from the Firestore document
     * @returns a NewsItem object which the front-end can handle
     */
    private convertNewsItemFromDB(doc: QueryDocumentSnapshot): NewsItem {
        const news: NewsItem = {
            id: doc.id,
            title: doc.get('title'),
            excerpt: doc.get('excerpt'),
            updateDate: doc.get('updateDate').toDate(),
            category: doc.get('categoryID'),
            status: doc.get('status'),
        };
        return news;
    }

    /**
     * @returns a 'full' News object matching the id
     */
    async readById(id: string): Promise<News> {
        const docRef = doc(this.db, this.collection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return this.convertNewsFromDB(docSnap);
        } else {
            return {} as News; // Document does not exist
        }
    }

    /**
     * @param doc the data as read from the Firestore document
     * @returns a News object which the front-end can handle
     */
    private convertNewsFromDB(doc: QueryDocumentSnapshot): News {
        const news: News = {
            id: doc.id,
            title: doc.get('title'),
            excerpt: doc.get('excerpt'),
            updateDate: doc.get('updateDate').toDate(),
            category: doc.get('categoryID'),
            status: doc.get('status'),
            creationDate: doc.get('creationDate').toDate(),
            text: doc.get('text'),
        };
        return news;
    }

    /**********
     * Update *
     **********/

    async update(news: News) {
        const newsRef = doc(this.db, this.collection, news.id);
        await updateDoc(newsRef, {
            title: news.title,
            excerpt: news.excerpt,
            updatedAt: new Date(),
            categoryID: news.category,
            status: news.status,
            text: news.text,
        });
    }

    /**********
     * Delete *
     **********/

    /**
     * @param id the ID of the news item to be deleted.
     */
    async delete(id: string) {
        const moduleRef = doc(this.db, this.collection, id);
        await deleteDoc(moduleRef);
    }
}
