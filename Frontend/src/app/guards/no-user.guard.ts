import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const noUserGuard: CanActivateFn = () => {
  const authService:AuthService = inject(AuthService);
  const router:Router = inject(Router);
  if (!authService.getToken()) return true;
  router.navigate(['/perfil-usuario']);
  return false;
};
