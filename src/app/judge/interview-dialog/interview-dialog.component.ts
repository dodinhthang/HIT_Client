import { Component, OnInit, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../node_modules/@angular/material';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-interview-dialog',
  templateUrl: './interview-dialog.component.html',
  styleUrls: ['./interview-dialog.component.scss']
})
export class InterviewDialogComponent implements OnInit {
  judgeName = new FormControl('', [Validators.required]);
  score = new FormControl('', [Validators.required]);
  hmtlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '19rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [
      // optional
      {
        name: 'quote',
        class: 'quote'
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1'
      }
    ]
  };

  // tslint:disable-next-line:max-line-length
  constructor(public dialogRef: MatDialogRef<InterviewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    console.log(this.data);
  }
  changeJudgeName($event) {
    this.data.judgeName = $event;
  }
  changeScore($event) {
    this.data.score = $event;
  }
}
