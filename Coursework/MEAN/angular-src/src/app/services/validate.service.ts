import { Injectable } from '@angular/core';
import { Registereduser } from '../registereduser';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateRegister(user: Registereduser): boolean {
    if (user.name == '' || user.username == '' || user.email == '' || user.password == '') {
      return false;
    }
    return true;
  }
}
