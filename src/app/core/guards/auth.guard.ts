import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Guard ensuring the user is authenticated and ACTIVE.
 */
export const requireAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.isPendingRole()) {
    return router.createUrlTree(['/pending-approval']);
  }

  return true;
};

/**
 * Guard for the Pending Approval route.
 */
export const requirePendingRoleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (!authService.isPendingRole()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};

/**
 * Guard for public routes (like Login).
 */
export const requireGuestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return authService.isPendingRole()
      ? router.createUrlTree(['/pending-approval'])
      : router.createUrlTree(['/dashboard']);
  }

  return true;
};
