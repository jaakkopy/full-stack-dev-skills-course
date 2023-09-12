import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Loggedinuser } from 'src/app/interfaces/loggedinuser';
import { Loginparams } from 'src/app/interfaces/loginparams';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);  
  router: Router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  onLoginSubmit() {
    const user: Loginparams = {
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? ''
    };

    this.authService.authenticateUser(user).subscribe(data => {
      if (data?.success) {
        const user: Loggedinuser = data.user;
        const jwt = data.token;
        this.authService.storeUserData(jwt, user);
        // TODO: notify of successful login
        this.router.navigate(['/'])
      } else {
        if (data?.msg) {
          // TODO: notify of failed login and show the provided message
        } else {
          // TODO: notify of failed login and show a generic failure message 
        }
        this.router.navigate(['/login']);
      } 
    });
  }
}