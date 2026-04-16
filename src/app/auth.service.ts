// ce fichier me sert a savoir qui est connecter
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from './auth-response';



// ici c'est l'url exacte de la route de connexion
const AUTH_LOGIN_URL = 'http://localhost:8080/api/auth/login';

@Injectable({
  // root veut dire injectable dans toute l'application
  providedIn: 'root'
})

export class AuthService {
   

  // ici je stocke la clé du currentUser dans le navigateur
  private KEY_USER = 'currentUser';
  // choisie 'USER' | 'ADMIN'
  // ici je stocke la clé de la vue ou du role affiché
  private KEY_VIEW = 'demoViewRole';
  // pour mon token
  // ici je stocke la clé du token JWT
  private KEY_TOKEN = 'token';

  // ici le constructeur injecte ce dont le service a besoin
  constructor(
    // ici j'injecte HttpClient pour appeler le bakend
    private http: HttpClient,
    // ici j'injecte Router pour faire les redirections
    private router: Router
  // ici je ferme le constructeur
  ) { }

  // cette methode me permet de lire le token stocké
  getToken(): string | null {
    // ici je retourne le token depuis le localStorage
    return localStorage.getItem(this.KEY_TOKEN);
  }

  // ici on fait la vraie connexion avec le bakend
  login(identifier: string, password: string): Observable<AuthResponse> {
    // j'envoie un POST vers /api/auth/login avec identifiant + mot de passe
    // ici je retourne directement l'observable de la requete HTTP
    return this.http
      // ici je fais le POST vers l'url de login avec le body attendu par le bakend
      .post<AuthResponse>(AUTH_LOGIN_URL, { identifier, password })
      // ici j'enchaine un pipe pour faire une action quand la reponse arrive
      .pipe(
        // des que le bakend repond je synchronise le token + user dans le localStorage
        // ici tap permet de faire une action sans modifier la reponse
        tap((authResponse) => this.syncFromBackend(authResponse))
      // ici je ferme le pipe
      );
  // ici je ferme la methode login
  }
  // pour deconnecter l'utilisateur dans la partie front en supprimant 
  // les infos  locales et rediriger vers / connexion 
  
  // pour supprimer un utilisateur et le rediriger sur le login 
  // cette methode sert a vider les infos de session
  logout(): void {
    // ici je supprime l'utilisateur connecté
    localStorage.removeItem(this.KEY_USER);
    // ici je supprime la vue ou le role courant
    localStorage.removeItem(this.KEY_VIEW);
    // je ferais cette partie plustard
    // ici je supprime aussi le token JWT
    localStorage.removeItem(this.KEY_TOKEN);
    // lien de la connexion
    // ici je redirige l'utilisateur vers la page connexion
    this.router.navigate(['/connexion']);
  // ici je ferme la methode logout
  }
  // vérifier si un utilisateur existe dans le locamStorage
  // cette methode permet de savoir si quelqu'un est connecté
  isLoggedIn(): boolean {

    // démo
    // / 'ADMIN' | 'USER' | null
    // ici je lis demoViewRole dans le navigateur
    const view = localStorage.getItem(this.KEY_VIEW);
     // JSON string | null
     // ici je lis currentUser dans le navigateur
     const user = localStorage.getItem(this.KEY_USER);
    // ici je retourne true si j'ai une vue USER ou ADMIN ou bien un user stocké
    return (view === 'ADMIN' || view === 'USER') || !!user;
  // ici je ferme la methode isLoggedIn
  }

  // isAdmin() = vrai si l'utilisateur stocké a le rôle ADMIN.
  // cette methode permet de savoir si l'utilisateur est admin
  isAdmin(): boolean {
    // role depuis currentUser
    // ici je lis l'utilisateur brut depuis le localStorage
    const raw = localStorage.getItem(this.KEY_USER);
   // ici je verifie qu'il existe bien quelque chose
   if (raw){
    // ici j'essaie de parser le JSON
    try {
      // ici je transforme la chaine JSON en objet
      const u = JSON.parse(raw);
      // ici si le role est ADMIN je retourne true directement
      if (u?.role === 'ADMIN') return true;
    // ici si le JSON est cassé j'evite que l'app plante
    } catch {

    }
   }
   // sinon role depuis la vue
   // ici si currentUser n'a rien donné je regarde demoViewRole
   const view = localStorage.getItem(this.KEY_VIEW);
   // ici je retourne true seulement si la vue vaut ADMIN
   return view === 'ADMIN'; 

// ici je ferme la methode isAdmin
}
// renvoie l'utilisateur stokés  ou null
// cette methode permet de récupérer l'utilisateur connecté
getUser(): { email: string; role: 'USER' | 'ADMIN' } | null {
  // ici je lis currentUser dans le navigateur
  const raw = localStorage.getItem(this.KEY_USER);
  // ici si raw existe je le parse sinon je retourne null
  return raw ? JSON.parse(raw) : null;
// ici je ferme la methode getUser
}
// cette methode prend la reponse du bakend et la range dans le navigateur
syncFromBackend(authResponse: { token?: string; email?: string; role?: string; user?: { email?: string; role?: string } }): void {
    // si le bakend renvoie un token je le stocke
    // ici je verifie qu'il y a bien un token dans la reponse
    if (authResponse?.token) {
      // ici je stocke le token dans le localStorage
      localStorage.setItem(this.KEY_TOKEN, authResponse.token);
    }

    // ici je récupére le role soit a la racine soit dans user si plus tard ca change
    // ici je mets le role en majuscule pour rester coherent
    const roleBack = (authResponse?.role ?? authResponse?.user?.role)?.toUpperCase();
    // ici je vérifie que le role est bien USER ou ADMIN
    if (roleBack === 'ADMIN' || roleBack === 'USER') {
      // ici je récupére le mail pareil soit a la racine soit dans user
      // ici si y'a pas de mail je mets inconnu par securité
      const email = authResponse?.email ?? authResponse?.user?.email ?? 'inconnu';
      // je stocke currentUser pour savoir qui est connecter
      // ici je mets email + role dans currentUser
      localStorage.setItem(this.KEY_USER, JSON.stringify({ email, role: roleBack }));
      // je stocke aussi demoViewRole pour les guards et les redirections
      // ici je synchronise aussi demoViewRole avec le vrai role
      localStorage.setItem(this.KEY_VIEW, roleBack);
    }
  // ici je ferme la methode syncFromBackend
  }
// ici je ferme la classe AuthService
}
