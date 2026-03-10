import { Injectable } from '@angular/core';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';

/**
 * Firebase Storage API for images. Provides methods to upload and delete images in the Firebase Storage bucket.
 * Images aren't stored with their original name, rather using a GUID thus making locating the image more difficult.
 */
@Injectable({
    providedIn: 'root',
})
export class ImageApi {
    // The storage bucket where the images are stored at
    private storage = getStorage();

    /**
     * Images aren't stored with their original name, rather using a GUID thus making locating the image
     * more difficult.
     *
     * @param file the image as a File object
     * @param path the path where in the storage bucket the image has to be uploaded. For an article image
     *    this will be 'images/articles/${guid} where ${guid} is the value of a GUID.
     * @returns the URL to the image (on the internet).
     */
    async uploadImage(file: File, path: string): Promise<string> {
        const storageRef = ref(this.storage, path);
        const uploadResult = await uploadBytes(storageRef, file);
        return await getDownloadURL(uploadResult.ref);
    }

    /**
     * @param path the path to the image in the storage bucket which has to be removed.
     */
    async deleteImage(path: string): Promise<void> {
        const storageRef = ref(this.storage, path);
        await deleteObject(storageRef);
    }
}
