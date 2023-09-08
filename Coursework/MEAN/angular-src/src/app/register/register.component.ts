import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Registereduser } from '../registereduser';
import { ValidateService } from '../services/validate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  validateService: ValidateService = inject(ValidateService);

  registerForm = new FormGroup({
    name: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  onRegisterSubmit(): boolean {
    const user: Registereduser = {
      name: this.registerForm.value.name ?? '',
      username: this.registerForm.value.username ?? '',
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? '',
    };

    if (!this.validateService.validateRegister(user)) {
      console.log("register validation fail");
      return false;
    }

    if (!this.validateService.validateEmail(user.email)) {
      console.log("email validation fail");
      return false;
    }

    return true;
  }

}
