import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthRouteGuard } from './guards/auth.guard';
import { GroupsComponent } from './components/groups/groups.component';
import { ListsComponent } from './components/lists/lists.component';
import { ListComponent } from './components/list/list.component';
import { AllListsComponent } from './components/all-lists/all-lists.component';
import { GroupStatsComponent } from './components/group-stats/group-stats.component';
import { GroupComponent } from './components/group/group.component';

const routes: Routes = [
  {path: '', component: GroupsComponent, canActivate: [AuthRouteGuard]},
  {path: 'groups', component: GroupsComponent, canActivate: [AuthRouteGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'lists', component: AllListsComponent, canActivate: [AuthRouteGuard]},
  {path: 'lists/:groupid', component: ListsComponent, canActivate: [AuthRouteGuard]},
  {path: 'list/:listid', component: ListComponent, canActivate: [AuthRouteGuard]},
  {path: 'stats/:groupid', component: GroupStatsComponent, canActivate: [AuthRouteGuard]},
  {path: 'group/:groupid', component: GroupComponent, canActivate: [AuthRouteGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
