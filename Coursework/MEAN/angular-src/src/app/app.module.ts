import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'profile', component: ProfileComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
