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
    where,
} from '@angular/fire/firestore';
import { Chapter, chapterInitialState, ChapterItem } from '../../models/chapter';
import { objectStatus } from '../../models/status';

/**
 * CRUD FIREBASE implementation for Chapter objects, which are always part of an Article.
 */
@Injectable({
    providedIn: 'root',
})
export class ChapterApi {
    // The name of the collection where the data is stored in
    private collection: string = 'chapters';

    // The 'connection' to the Firestore database
    private db: Firestore = inject(Firestore);

    /**********
     * Create *
     **********/

    /**
     * @param category the information of the to be created chapter.
     * @returns the newly created Chapter object including its generated database ID.
     */
    async create(chapter: Chapter): Promise<Chapter> {
        await addDoc(collection(this.db, this.collection), {
            articleId: chapter.article,
            title: chapter.title,
            order: chapter.order,
            showTitle: chapter.showTitle,
            text: chapter.text,
            imageUrl: chapter.image.imageUrl,
            imageCaption: chapter.imageCaption,
        }).then((doc) => {
            chapter.id = doc.id;
        });
        return chapter;
    }

    /********
     * Read *
     ********/

    /**
     * @returns a list of all known chapters
     */
    async readAll(): Promise<ChapterItem[]> {
        const chapters: ChapterItem[] = [];
        const q = query(collection(this.db, this.collection));
        await getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                chapters.push(this.convertChapterItemFromDB(doc));
            });
        });
        return chapters;
    }

    /**
     * @returns a list of all known chapters belonging to 1 particular article
     */
    async readByArticle(articleId: string): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        const q = query(
            collection(this.db, this.collection),
            where('articleId', '==', articleId),
            orderBy('order'),
        );
        await getDocs(q)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    chapters.push(this.convertChapterFromDB(doc));
                });
            })
            .catch((e) => console.log(e));
        return chapters;
    }

    /**
     * @param doc the data as read from the Firestore document
     * @returns a ChapterItem object which the front-end can handle
     */
    private convertChapterItemFromDB(doc: QueryDocumentSnapshot): ChapterItem {
        const chapter: ChapterItem = {
            id: doc.id,
            title: doc.get('title'),
            article: doc.get('articleId'),
            order: doc.get('order'),
            status: objectStatus.Unchanged,
        };
        return chapter;
    }

    /**
     * @returns a 'full' Chapter object matching the id
     */
    async readById(id: string): Promise<Chapter> {
        const docRef = doc(this.db, this.collection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return this.convertChapterFromDB(docSnap);
        } else {
            return chapterInitialState; // Document does not exist
        }
    }

    /**
     * @param doc the data as read from the Firestore document
     * @returns a Chapter object which the front-end can handle
     */
    private convertChapterFromDB(doc: QueryDocumentSnapshot): Chapter {
        const chapter: Chapter = {
            id: doc.id,
            title: doc.get('title'),
            article: doc.get('articleId'),
            order: doc.get('order'),
            status: objectStatus.Unchanged,
            showTitle: doc.get('showTitle'),
            text: doc.get('text'),
            image: {
                imageUrl: doc.get('imageUrl'),
                imageFile: null,
            },
            imageCaption: doc.get('imageCaption'),
        };
        return chapter;
    }

    /**********
     * Update *
     **********/

    async update(chapter: Chapter) {
        const newsRef = doc(this.db, this.collection, chapter.id);
        await updateDoc(newsRef, {
            articleId: chapter.article,
            title: chapter.title,
            showTitle: chapter.showTitle,
            text: chapter.text,
            imageUrl: chapter.image.imageUrl,
            imageCaption: chapter.imageCaption,
        });
    }

    /**********
     * Delete *
     **********/

    /**
     * @param id the ID of the chapter  to be deleted.
     */
    async delete(id: string) {
        const moduleRef = doc(this.db, this.collection, id);
        await deleteDoc(moduleRef);
    }
}
