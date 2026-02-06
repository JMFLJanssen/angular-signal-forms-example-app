import { inject, Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDocs,
    orderBy,
    query,
    QueryDocumentSnapshot,
    updateDoc,
} from '@angular/fire/firestore';
import { Category } from '../../models/category';

/**
 * CRUD FIREBASE implementation for Category objects.
 */
@Injectable({
    providedIn: 'root',
})
export class CategoryApi {
    // The name of the collection where the data is stored in
    private collection: string = 'categories';

    // The 'connection' to the Firestore database
    private db: Firestore = inject(Firestore);

    /**********
     * Create *
     **********/

    /**
     * @param category the information of the to be created category.
     * @returns the newly created Category object including its generated database ID.
     */
    async create(category: Category): Promise<Category> {
        await addDoc(collection(this.db, this.collection), {
            name: category.name,
        }).then((doc) => {
            category.id = doc.id;
        });
        return category;
    }

    /********
     * Read *
     ********/

    /**
     * @returns a list of all known categories
     */
    async readAll(): Promise<Category[]> {
        const categories: Category[] = [];
        const q = query(collection(this.db, this.collection), orderBy('name'));
        await getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                categories.push(this.convertCategoryFromDB(doc));
            });
        });
        return categories;
    }

    /**
     * @param doc the data as read from the Firestore document
     * @returns a Category object which the front-end can handle
     */
    private convertCategoryFromDB(doc: QueryDocumentSnapshot): Category {
        const category: Category = {
            id: doc.id,
            name: doc.get('name'),
        };
        return category;
    }

    /**********
     * Update *
     **********/

    /**
     * @param category the new information of an existing category.
     */
    async update(category: Category) {
        const moduleRef = doc(this.db, this.collection, category.id);
        await updateDoc(moduleRef, {
            name: category.name,
        });
    }

    /**********
     * Delete *
     **********/

    /**
     * @param id the ID of the category to be deleted.
     */
    async delete(id: string) {
        const moduleRef = doc(this.db, this.collection, id);
        await deleteDoc(moduleRef);
    }
}
