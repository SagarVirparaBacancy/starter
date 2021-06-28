import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from './helper/auth-guard.guard';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EditUserComponent } from './views/edit-user/edit-user.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { UserListComponent } from './views/user-list/user-list.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  // { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardGuard] },
  { path: 'user-list', component: UserListComponent, canActivate: [AuthGuardGuard] },
  { path: 'edit-user/:id', component: EditUserComponent, canActivate: [AuthGuardGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
