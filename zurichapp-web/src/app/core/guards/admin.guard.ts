import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const adminGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  const user = storage.getUser();
  if (user?.role === 'Administrador') return true;

  router.navigate(['/login']);
  return false;
};
