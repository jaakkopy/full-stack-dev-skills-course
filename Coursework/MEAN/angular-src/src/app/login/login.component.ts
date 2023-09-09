import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Loginparams } from '../loginparams';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2'
import { Loggedinuser } from '../loggedinuser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
        Swal.fire('Login successful', 'You are logged in', 'success');
        this.router.navigate(['/dashboard'])
      } else {
        if (data?.msg) {
          Swal.fire('Login failed', data?.msg, 'warning');
        } else {
          Swal.fire('Login failed', 'warning');
        }
        this.router.navigate(['/login']);
      } 
    });
  }
}
