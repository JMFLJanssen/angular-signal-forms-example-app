<div align="center">
  <h1>🚨 Angular Signal Forms Example App</h1>

  <p>
    Your <strong>real-world</strong> Angular Signal Forms example app - build for <strong>learning</strong> & <strong>productivity</strong> if you're looking for to add news/articles to your project.
    <br><br>
    Build with ❤️ to showcase real best practices in action (without repetition of <a href="https://angular.dev/tutorials/signal-forms">basic</a> tutorials): addition of a, existing, rich text editor package, a reusable image uploader and lists of child forms (combining the earlier 2 given). 
    <br><br>
    <a href="https://blog-signal-form.firebaseapp.com/home"><strong>🔥 Live Demo</strong></a>
  </p>
</div>

---

## 📦 Why This Project?

Started with Signal Forms and looking to expand your forms? This project, and the accompanying articles, has you covered.

- ✅ **Beginner-friendly**: Clean code, best practices, and detailed structure.
- ✅ **Production-ready**: complete API, modular architecture, lots of code comments and a set of 3 articles in <a href="https://medium.com/">Medium</a>
- ✅ **Feature-rich**: Not just a to-do list or a login form. Real-world logic showcasing a news & article CMS.

---

## 🌍 Backend API

This app connects to a real backend powered by Firebase. Due to the Google billing conditions of Firebase the, accompanying, demo doesn't allow for actual database writes. Yes the demo shows the full features of Signal Forms, its the actual create/update/delete API calls that have been disabled. Want to see this working? Create your own version of this project with your own Firebase project.

---

## 🛠️ Getting Started

**Step 1**: Create a Firebase Project
- Visit the Firebase <a href="https://console.firebase.google.com/">Console</a>
- Click “Create a new Firebase project” and follow the prompts to create a new Firebase project.
- Form the "Build" product category add Hosting, Firestore Database & Storage and follow the instructions to add hosting, create the database and create the storage bucket (for this the pricing plan needs to be upgraded).

**Step 2**: Set up Firebase
```bash
npm install -g firebase-tools
```

**Step 3**: Install as new project
- Download the project
- install modules: <code>--force</code> is needed since up-to-date (feb 6 2026) @angular/fire is not yet v21 compatible, but still usable.
```bash
npm i --force
```
- Goto the Firebase project and copy the project's General Settings and copy your web app's Firebase configuration.
- open <code>app.config.ts</code> and replace the impersonalized firebase settings for yours.

---

## ✨ Features

- ✅ **Angular 21**: Using the latest version
- ✅ **Angular Material**: Using the latest version
- ✅ **Custom styling**: On top of Angular Material
- ✅ **Ngx-editor**: As rich text editor

---

## 🧩 Roadmap
Although not Signal Form related this project only becomes a true real-world example when access to the CMS is restricted for editors & admins. For this the following features still have to be implemented.

- [ ] Firebase authentication & Role management
- [ ] Login & Registration
- [ ] CMS Behind Login & Add Role management

---

## 🐛 Found a bug? Got an idea?
I love feedback! I'm sure there is a bug somewhere or there are improved ways to get the same result. Got an idea or found a bug? [open an issue](https://github.com/JMFLJanssen/angular-signal-forms-example-app/issues/new).

---

## License

This project is licensed under the [MIT License](https://github.com/JMFLJanssen/angular-signal-forms-example-app/blob/master/LICENSE).
