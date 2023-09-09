import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Loggedinuser } from '../loggedinuser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  user: Loggedinuser | null = null; 

  ngOnInit() {
    const observable = this.authService.getProfile();
    if (observable == null)
      return;
    observable.subscribe(profileData => {
      this.user = profileData.user;
    });
  }
}
