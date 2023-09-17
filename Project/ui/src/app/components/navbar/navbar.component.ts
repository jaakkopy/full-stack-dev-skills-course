import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { showSuccessMessage } from 'src/app/services/notifications';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  onLogoutClick() {
    this.authService.logout();
    showSuccessMessage("Logged out").then(() => this.router.navigate(['/login']));
  }
}
