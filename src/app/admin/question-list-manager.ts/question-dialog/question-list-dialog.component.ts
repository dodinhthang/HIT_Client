import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-question-list-dialog',
  templateUrl: './question-list-dialog.component.html',
  styleUrls: ['./question-list-dialog.component.scss']
})
export class EditAddQuestionListDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<EditAddQuestionListDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    console.log(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  selected($event) {
    console.log(event);
  }
}
