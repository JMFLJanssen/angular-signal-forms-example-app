// News & Article statuses, allowing them to be worked on without being published until ready.
export enum status {
    Concept = 0 as number,
    Published = 1 as number,
}

// The Article form is split into three parts, the content, cover image and chapters. This enum is used to keep track
// the form status of each part, so that the user can be informed on which part of the form there is still an error.
export enum formStatus {
    New = 0 as number,
    Valid = 1 as number,
    Invalid = 2 as number,
}

// The status of the chapter, allowing it to be worked on without being published until ready. This is used in the chapter form.
// The chapters are saved when the article is saved, so the chapter status is used to keep track of which chapters are new, which
// are unchanged, which are updated and which are to be deleted. This allows the user to work on the chapters without having to
// worry about the status of the article.
export enum objectStatus {
    Unchanged = 0,
    New = 1,
    Updated = 2,
    ToBeDeleted = 3,
}
