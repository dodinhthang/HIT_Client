import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../../node_modules/@angular/material';

@Component({
  selector: 'app-edit-competitive-dialog',
  templateUrl: './edit-competitive-dialog.component.html',
  styleUrls: ['./edit-competitive-dialog.component.scss']
})
export class EditCompetitiveDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<EditCompetitiveDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
