import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideFirebaseApp(() =>
            initializeApp({
                projectId: 'blog-signal-form',
                appId: '1:934281691011:web:5da7f8b82c21af2ee980b6',
                storageBucket: 'blog-signal-form.firebasestorage.app',
                apiKey: 'AIzaSyBhWH9axnPT9eXf9s7ENfjIIn_3ImXn49E',
                authDomain: 'blog-signal-form.firebaseapp.com',
                messagingSenderId: '934281691011',
            }),
        ),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
    ],
};
