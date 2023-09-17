import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Loggedinuser } from 'src/app/interfaces/loggedinuser';
import { Loginparams } from 'src/app/interfaces/loginparams';
import { AuthService } from 'src/app/services/auth.service';
import { showFailureMessage, showSuccessMessage } from 'src/app/services/notifications';

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
        showSuccessMessage("Login successful").then(() => this.router.navigate(['/']));
      } else {
        showFailureMessage(data.content).then(() => this.router.navigate(['/login']));
      } 
    }, (err) => {
      showFailureMessage(err.error.content).then(() => this.router.navigate(['/login']));
    });
  }
}