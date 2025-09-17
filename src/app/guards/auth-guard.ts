// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']); // Redirect to login page if not authenticated
        return false;
      }
    })
  );
};