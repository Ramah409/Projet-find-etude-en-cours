// src/app/auth.guard.ts
// ce fichier me sert a réfuser l'accés a une route si on est pas connecté

import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  // pour recuperer le service 
  const auth = inject(AuthService);

  // pour recupere le router
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    // si l'utilisateur est connecté c'est ok 
    return true;
  } else {
    // si c'est le contraire on redirige vers login 
    // ici on passe l’URL demandée pour revenir après connexion
    router.navigate(['/connexion'], { queryParams: { redirect: state.url } });
    return false;
  }
};
