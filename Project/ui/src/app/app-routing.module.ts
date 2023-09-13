import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthRouteGuard } from './guards/auth.guard';
import { GroupsComponent } from './components/groups/groups.component';
import { ListsComponent } from './components/lists/lists.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthRouteGuard]},
  {path: 'groups', component: GroupsComponent, canActivate: [AuthRouteGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'lists/:groupid', component: ListsComponent, canActivate: [AuthRouteGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
