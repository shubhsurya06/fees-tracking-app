import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  let router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['login']);
    authService.loggedInSubject.next(false);
    return false;
  }
  authService.loggedInSubject.next(true);
  return true;
};
