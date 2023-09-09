import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Loginparams } from '../loginparams';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  onLoginSubmit() {
    const user: Loginparams = {
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? ''
    };
  }
}
