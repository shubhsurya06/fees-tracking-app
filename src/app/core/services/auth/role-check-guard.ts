import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user/user-service';
import { role_allowed_routes } from '../../constant/route.constant';

export const roleCheckGuard: CanActivateFn = (route, state) => {
  const userSrv = inject(UserService);
  const roueter = inject(Router);
  const role = userSrv.loggedInUser().role;
  if (role != undefined) {
    const routeName = state.url.slice(1);
    const roleRoute = role_allowed_routes.find(m => m.path == routeName);
    const isRolePresent = roleRoute?.rolesAllowed.includes(role);
    if (isRolePresent) {
      return true;
    } else {
      roueter.navigateByUrl('/roleerror');
      return false;
    }
  } else {
    roueter.navigateByUrl('/roleerror')
    return false;
  }
};
