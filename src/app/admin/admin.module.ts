import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { QuestionManagerComponent } from './question-manager/question-manager.component';
import { CompetitiveManagerComponent } from './competitive-manager/competitive-manager.component';
import { MatterialModule } from '../material/material.module';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';
import { EditCompetitiveDialogComponent } from './competitive-manager/edit-competitive-dialog/edit-competitive-dialog.component';
import { EditAddDialogComponent } from './question-manager/question-dialog/question-dialog.component';
import { EditUserDialogComponent } from './user-manager/edit-user-dialog/edit-user-dialog.component';
import { ProblemManagerComponent } from './problem-manager/problem-manager.component';
import { ProblemDialogComponent } from './problem-manager/problem-dialog/problem-dialog.component';
import { QuestionListManagerComponent } from './question-list-manager.ts/question-list-manager.component';
import { EditAddQuestionListDialogComponent } from './question-list-manager.ts/question-dialog/question-list-dialog.component';
@NgModule({
  imports: [CommonModule, AdminRoutingModule, MatterialModule, FormsModule, ReactiveFormsModule],
  // tslint:disable-next-line:max-line-length
  declarations: [
    AdminComponent,
    UserManagerComponent,
    QuestionManagerComponent,
    CompetitiveManagerComponent,
    QuestionDialogComponent,
    EditCompetitiveDialogComponent,
    EditAddDialogComponent,
    EditUserDialogComponent,
    ProblemManagerComponent,
    ProblemDialogComponent,
    QuestionListManagerComponent,
    EditAddQuestionListDialogComponent
  ],
  exports: [QuestionDialogComponent],
  // tslint:disable-next-line:max-line-length
  entryComponents: [
    QuestionDialogComponent,
    EditCompetitiveDialogComponent,
    EditUserDialogComponent,
    QuestionDialogComponent,
    EditAddDialogComponent,
    ProblemDialogComponent,
    EditAddQuestionListDialogComponent
  ]
})
export class AdminModule {}
