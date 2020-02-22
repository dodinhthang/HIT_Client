import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APIModule } from './services/service.module';
import { CommonModule } from '@angular/common';
import { MatterialModule } from './material/material.module';
import { SocketService } from './socket';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import 'hammerjs';
import { QuestionDialogComponent } from './question-dialog/question-dialog.component';
import { AdminGuardService } from './services/admin-guard.service';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  // tslint:disable-next-line:max-line-length
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MatterialModule,
    CommonModule,
    APIModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [SocketService, AdminGuardService],
  bootstrap: [AppComponent],
  exports: [MatterialModule]
})
export class AppModule {}
