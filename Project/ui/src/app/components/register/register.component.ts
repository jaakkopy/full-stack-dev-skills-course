import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Registerparams } from 'src/app/interfaces/registerparams';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  validateService: ValidateService = inject(ValidateService);  
  authService: AuthService  = inject(AuthService);  
  router: Router = inject(Router);

  registerForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  onRegisterSubmit() {
    const registerParams: Registerparams = {
      username: this.registerForm.value.username ?? '',
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? ''
    };

    if (!this.validateService.validateRegister(registerParams) || !this.validateService.validateEmail(registerParams.email)) {
      // TODO: notify of failure
      return;
    }

    this.authService.registerUser(registerParams).subscribe((data: any) => {
      if (data?.success) {
        // TODO: notify of success
        this.router.navigate(['/login']); 
      } else {
        // TODO: notify of failure
        this.router.navigate(['/register']); 
      }
    });

  }
}
