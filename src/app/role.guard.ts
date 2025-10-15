// ce fichier me permet d'autoriser des routes uniquement par exemple si le role de l'utilisateur 
// correspond aux roles attendues 
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';


export const roleGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);
  // pour rediriger si l'accés a ete interdit
  const router = inject(Router);

  // pour lire les role par la route
  const expected = (route.data?.['role'] as Array<'ADMIN' | 'USER' >) ?? [];

  // pour determiner le role de l'utilisateur connecté
  const user = auth.getUser();
  const view = (localStorage.getItem('demoViewRole') as 'ADMIN' | 'USER' | null);
  const role: 'ADMIN' | 'USER' | null = (user?.role as any) ?? view ?? null;

  // si par exemple on est pas connecté ou role inconnu redirection vers la page connexion
  if (!role){
    router.navigate(['/connexion'], { queryParams: { redirect: state.url } });
    // accés réfuser 
    return false;
  }
  // genre le role est exiger mais ca na pas ete respecter on refuse l'acces et plus redirection
  if (expected.length && !expected.includes(role)){
    // si un ADMIN qui tente d’aller sur une route réservée USER
    // ou inversement → on le renvoie vers une page cohérente avec son rôle.
    router.navigate([ role === 'ADMIN' ? '/admin' : '/produits']);
    return false;
  }
  // si tout est ok on laisse passer
  return true;
};
