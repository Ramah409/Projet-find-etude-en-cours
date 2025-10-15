// ce fichier me sert a savoir qui connecter 
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
   
  // nom de la clé utilisée dans le localStorage qui est la memoire du navigateur

  private KEY_USER = 'currentUser';
  // choisie 'USER' | 'ADMIN'
  private KEY_VIEW = 'demoViewRole';
  // pour mon token
  private KEY_TOKEN = 'token';

  constructor(private router: Router) { }

   getToken(): string | null {
    return localStorage.getItem(this.KEY_TOKEN);
  }

  // pour simuler une connexion 
  login(email: string, password: string, role: 'USER' | 'ADMIN' = 'USER'): boolean {
    if (!email || !password){
      // si l'email ou le mot de passe est vide on refuse l'accés
      return false;
    }
    // le role en majuscule pour rester coherent 
    const roleNorm = role.toUpperCase() as 'USER' | 'ADMIN';

    // on mémorise l'utilisateur dans le navigateur
    const user = { email, role: roleNorm};
    localStorage.setItem(this.KEY_USER, JSON.stringify(user));

    // utilisée par le guard / Connexion
    localStorage.setItem(this.KEY_VIEW, roleNorm);

    return true;
  }
  // pour deconnecter l'utilisateur dans la partie front en supprimant 
  // les infos  locales et rediriger vers / connexion 
  
  // pour supprimer un utilisateur et le rediriger sur le login 
  logout(): void {
    localStorage.removeItem(this.KEY_USER);
    localStorage.removeItem(this.KEY_VIEW);
    // je ferais cette partie plustard
    localStorage.removeItem(this.KEY_TOKEN);
    // lien de la connexion
    this.router.navigate(['/connexion']);
  }
  // vérifier si un utilisateur existe dans le locamStorage
  isLoggedIn(): boolean {

    // démo
    // / 'ADMIN' | 'USER' | null
    const view = localStorage.getItem(this.KEY_VIEW);
     // JSON string | null
     const user = localStorage.getItem(this.KEY_USER);
    return (view === 'ADMIN' || view === 'USER') || !!user;
  }

  // isAdmin() = vrai si l'utilisateur stocké a le rôle ADMIN.
  isAdmin(): boolean {
    // role depuis currentUser
    const raw = localStorage.getItem(this.KEY_USER);
   if (raw){
    try {
      const u = JSON.parse(raw);
      if (u?.role === 'ADMIN') return true;
    } catch {

    }
   }
   // sinon role depuis la vue
   const view = localStorage.getItem(this.KEY_VIEW);
   return view === 'ADMIN'; 

}
// renvoie l'utilisateur stokés  ou null
getUser(): { email: string; role: 'USER' | 'ADMIN' } | null {
  const raw = localStorage.getItem(this.KEY_USER);
  return raw ? JSON.parse(raw) : null;
}
// permet d'enregistre le role si je me le token qd mon bakend les renverra
syncFromBackend(authResponse: { token?: string, user?: { email?: string; role?: string } }): void {
    // token (si tu en as un plus tard)
    if (authResponse?.token) {
      localStorage.setItem(this.KEY_TOKEN, authResponse.token);
    }

    // rôle "réel" côté backend (si fourni)
    const roleBack = authResponse?.user?.role?.toUpperCase();
    if (roleBack === 'ADMIN' || roleBack === 'USER') {
      // on stocke currentUser et on synchronise la vue
      const email = authResponse.user?.email ?? 'inconnu';
      localStorage.setItem(this.KEY_USER, JSON.stringify({ email, role: roleBack }));
      localStorage.setItem(this.KEY_VIEW, roleBack);
    }
  }
}
