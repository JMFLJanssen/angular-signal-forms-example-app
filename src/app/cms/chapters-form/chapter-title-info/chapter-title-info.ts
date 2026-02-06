import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'chapter-title-info',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './chapter-title-info.html',
})
export class ChapterTitleInfo {
    readonly dialogRef = inject(MatDialogRef<ChapterTitleInfo>);
}
