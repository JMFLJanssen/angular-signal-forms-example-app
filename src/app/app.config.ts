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
                projectId: 'angular-signal-forms-example',
                appId: 'x:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxx',
                storageBucket: 'angular-signal-forms-example.firebasestorage.app',
                apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxxx',
                authDomain: 'angular-signal-forms-example-app.firebaseapp.com',
                messagingSenderId: 'xxxxxxxxxxxx',
            }),
        ),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
    ],
};
