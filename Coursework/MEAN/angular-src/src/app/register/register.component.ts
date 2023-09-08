import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Registereduser } from '../registereduser';
import { ValidateService } from '../services/validate.service';
import Swal from 'sweetalert2'

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
      Swal.fire('Registration error', 'Please fill in all the fields', 'warning');
      return false;
    }

    if (!this.validateService.validateEmail(user.email)) {
      Swal.fire('Registration error', 'Please enter a valid email', 'warning');
      return false;
    }

    return true;
  }

}
