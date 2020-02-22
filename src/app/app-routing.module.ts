import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminGuardService } from './services/admin-guard.service';
import { JudgeGuardService } from './services/judge-guard.service';
import { UserGuardService } from './services/user-guard.service';
const routes: Routes = [
  // { path: 'judge', component: JudgeComponent },
  // // { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'login', component: LoginComponent },
  // { path: '**', component: ErrorPageComponent },
  { path: 'user', canActivate: [UserGuardService], loadChildren: './user/user.module#UserModule' },
  { path: 'admin', canActivate: [AdminGuardService], loadChildren: './admin/admin.module#AdminModule' },
  { path: 'judge', canActivate: [JudgeGuardService], loadChildren: './judge/judge.module#JudgeModule' },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
