import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RegisterParams } from '../registerparams';
import { ValidateService } from '../services/validate.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  validateService: ValidateService = inject(ValidateService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  registerForm = new FormGroup({
    name: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  onRegisterSubmit(): boolean {
    const user: RegisterParams = {
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

    this.authService.registerUser(user).subscribe((data: any) => {
      if (data?.success) {
        Swal.fire('Success', 'Registration successful', 'success');
        this.router.navigate(['/login']); 
      } else {
        Swal.fire('Failure', 'Something went wrong', 'error');
        this.router.navigate(['/register']); 
      }
    });

    return true;
  }

}
