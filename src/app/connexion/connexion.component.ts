import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../user-api.service';


@Component({
  selector: 'app-connexion',
  standalone: true,
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
  imports: [FormsModule],
})
export class ConnexionComponent implements OnInit {
  // pour saisi les informations ici on peut mettre soit email ou username 
  identifier: string = '';                 
  password: string = ''; 
 
  // utilisable uniquement sur la partie front genre il sera pas envoyer au bakend          
  role: 'USER' | 'ADMIN' = 'USER';

  // message d'info si on s'incrit
  info = '';
  error = '';
  success = '';

  constructor(
    private auth: AuthService,
    private api: UserApiService,
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  // sur la page inscription on affichera ce message genre compte a été crée....
  ngOnInit(): void {
    // qd on arrive a la page d'inscription on affichera un petit message d'information
    const registered = this.route.snapshot.queryParamMap.get('registered')
    if (registered === '1') {
      this.info = "Votre compte a bien été créé. Vous pouvez vous connecter";
    }
    // restauration des info genre qd on choisie USER/ADMIN depuis localStoral
    // ca permet de garder la meme vue qd on revient sur la page
    const savedView = localStorage.getItem('demoViewRole');
    if ( savedView === 'ADMIN' || savedView === 'USER'){
      this.role = savedView as 'ADMIN' | 'USER'; 
    }
  
  }
  // soumission du formulaire de login 
  onSubmit(): void {
    // validation 
    if (!this.identifier || !this.password){
      // si un de champs de pas remplie y'aura se message
      this.error = 'Identifiant et mot de passe obligatoires';
      // je supprime le message de succès précédent
      this.success = '';
      // si le formulaire est incomplet y'a rien qui va etre envoyer au bakend
      return;
    }
    // Appel a mon bakend genre  POST /api/auth/login
    this.api.login(this.identifier, this.password).subscribe({

      // en cas de succees
      next: (resp: any) => {
        // je réintialise les messages d'erreur
        this.error = '';
        // ce message sera visible sous le titre
        this.success = 'Connexion réussie';

        // (Plus tard) si le backend renvoie un JWT : localStorage.setItem('token', resp.token);

          // 1) je récupérer le token 
         const token: string | undefined = resp?.token;
         // apres avoir recu le token
         if (token) {
         localStorage.setItem('token', token);            
         }

        // 🎫 role retourné par le bakend
        let effectiveRole: 'ADMIN' | 'USER' = this.role;
        if (resp?.role === 'ADMIN' || resp?.role === 'USER'){
          effectiveRole = resp.role;
        }
        // memorisation de l'utilisateur
        const email = resp?.email ?? this.identifier;

        // memorisation de la vue pour d'autres ecran 
        localStorage.setItem('demoViewRole', effectiveRole);

        // pour stoker l'objet genre mail, role pour que ton AuthService/RoleGuard puissent savoir "qui est connecté".
        localStorage.setItem('currentUser', JSON.stringify({ email, role: effectiveRole }))

        // redirection apres succès selon les roles
        
        // si par exemple ADMIN = page administration
        // USER = page de produits
        if (effectiveRole === 'ADMIN') {
          this.router.navigate(['/admin'], { queryParams: { welcome: '1'}});
        } else {
          this.router.navigate(['/produits'], { queryParams: { welcome: '1'}});
        }
      },
      // en cas d'erreur genre 400/404/500
      error: (err) => {
        const msg = err?.error?.message || 'Connexion impossible';

        // 404 Utilisateur introuvable
        if (err?.status === 404){
          this.error = msg;
          this.success = '';
          return;
        }
        // 400 mot de passe obligatoire ou soit identifiant
        if (err?.status === 400){
          this.error = msg;
          this.success = '';
          return;
        }
        // 500 erreur interne genre coté serveur
        this.error = 'Erreur interne ';
        this.success = '';

      }

    });
  
    }
   
  }

