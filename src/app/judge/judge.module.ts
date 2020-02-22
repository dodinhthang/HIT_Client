import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JudgeRoutingModule } from './judge-routing.module';
import { JudgeComponent } from './judge.component';
import { InterviewDialogComponent } from './interview-dialog/interview-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [CommonModule, JudgeRoutingModule, MatterialModule, FormsModule, ReactiveFormsModule, AngularEditorModule, HttpClientModule],
  declarations: [JudgeComponent, InterviewDialogComponent],
  entryComponents: [InterviewDialogComponent]
})
export class JudgeModule {}
