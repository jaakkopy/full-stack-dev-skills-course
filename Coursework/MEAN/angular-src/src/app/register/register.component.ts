import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  onRegisterSubmit() {
    console.log(this.registerForm.value.name, this.registerForm.value.username);
  }
}
