import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { MatterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user.component';
import { CompetitiveComponent } from './competitive/competitive.component';

@NgModule({
  imports: [CommonModule, UserRoutingModule, MatterialModule, FormsModule, ReactiveFormsModule],
  declarations: [UserComponent, CompetitiveComponent]
})
export class UserModule {}
