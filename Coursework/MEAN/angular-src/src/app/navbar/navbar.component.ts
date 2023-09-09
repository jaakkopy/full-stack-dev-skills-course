import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authService: AuthService = inject(AuthService);

  onLogoutClick() {
    this.authService.logout();
    Swal.fire('Logged out', 'You are logged out', 'success'); 
  }
}
