import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JudgeComponent } from './judge.component';

const routes: Routes = [
  {
    path: '',
    component: JudgeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JudgeRoutingModule {}
