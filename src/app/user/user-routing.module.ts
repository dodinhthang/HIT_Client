import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { CompetitiveComponent } from './competitive/competitive.component';
const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'competitive', component: CompetitiveComponent }
      // {path:'',redirectTo:'play',pathMatch:'prefix'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
