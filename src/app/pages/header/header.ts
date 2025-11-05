import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth-service';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  id: string = '0';

  constructor() {
    // Listen to router events to get the current route parameters
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '0';
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
