import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

// ce bloc est comme la carte d'identé de mon composant y'a tt les infos
@Component({
  selector: 'app-connexion', // nom d ma balise 
  standalone: true,
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
  imports: [FormsModule],
})
export class ConnexionComponent implements OnInit {
  // pour saisi les informations ici on peut mettre soit email ou username 
  // mes variables 
  identifier: string = '';                 
  password: string = ''; 
 
  // utilisable uniquement sur la partie front genre il sera pas envoyer au bakend          
  role: 'USER' | 'ADMIN' = 'USER';

  // message d'info si on s'incrit
  info = '';
  error = '';
  success = '';

 
  constructor(
    // pour avoir accés a mon service 
    private auth: AuthService, 
    private router: Router, 
    // pour lire les paramettre de l'URL
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
    this.auth.login(this.identifier, this.password).subscribe({

      // en cas de succees
      next: () => {
        // je réintialise les messages d'erreur
        this.error = '';
        // ce message sera visible sous le titre
        this.success = 'Connexion réussie';

        // on relit le rôle effectivement synchronisé par AuthService
        const effectiveRole = this.auth.getUser()?.role ?? this.role;

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
