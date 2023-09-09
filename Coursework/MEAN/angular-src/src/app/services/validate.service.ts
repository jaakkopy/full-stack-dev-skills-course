import { Injectable } from '@angular/core';
import { RegisterParams } from '../registerparams';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateRegister(user: RegisterParams): boolean {
    if (user.name == '' || user.username == '' || user.email == '' || user.password == '') {
      return false;
    }
    return true;
  }

  validateEmail(email: String): boolean {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) != null;
  }
}
