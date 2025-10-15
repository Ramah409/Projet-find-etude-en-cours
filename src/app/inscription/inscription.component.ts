import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { UserApiService } from '../user-api.service'; 
import { Router } from '@angular/router';
import { RegisterRequest } from '../register-request';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  // Champs du formulaire
  name = '';
  email = '';
  username = '';
  password = '';
  password2 = '';

  // Messages UI via mon template genre html if...
  error = '';
  success = '';

  // liste des erreurs par champ envoyer par le bakend
   erreursChamps: { field: string; message: string }[] = [];

  // fait appel a mon bakend
  constructor(private userApi: UserApiService, private router: Router){}

  // Appelé quand on clique sur "Créer mon compte"
  onSubmit(): void {
    // 1) Validations basiques (front)
    if (!this.name || !this.email || !this.username || !this.password || !this.password2) {
      // en cas d'erreur s'affiche en rouge
      this.error = 'Tous les champs sont obligatoires';
      this.success = '';
      // ici je vide la liste detaillée
      this.erreursChamps = [];
      return;
    }
    if (this.password !== this.password2) {
      this.error = 'Les mots de passe ne correspondent pas';
      this.success = '';
      this.erreursChamps = [];
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      this.success = '';
      this.erreursChamps = [];
      return;
    }

    // 2) Construire l'objet attendu par /api/auth/register
    const body: RegisterRequest = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    };

    // 3) Appeler l'API d'inscription genre (POST /auth/register)
    this.userApi.register(body).subscribe({
      // Le serveur a répondu 200/201
      next: (_createdUser) => {
        // Succès → message + redirection vers connexion
        this.success = 'Votre compte a bien été créé. Vous pouvez vous connecter.';
        this.error = '';
        this.erreursChamps = [];
        // puis on redirige vers la page de connexion
        this.router.navigate(['/connexion']);
      },
      error: (err) => {
        // Message lisible renvoyé par le backend (ValidationException, etc.)
        const msg = err?.error?.message || 'Inscription impossible';

        // en lien avec mon bakend la gestion des erreurs 

        // 409 conflit C'est a dire l'email ou username deja utiliser
        if (err?.status === 409){
          this.error = msg;
          this.success = '';
          // ici on cava rester vide pour éviter d'afficher des anciennes erreurs
          this.erreursChamps = [];
          return;
        }
        // Erreur 422 
        // On récupère la liste renvoyée par mon ErrorHondler
        if (err?.status === 422 && Array.isArray(err?.error?.details)){
          this.error = err.error?.message || 'Certains champs sont invalides';
          this.success = '';
          // ici je parcours ici pour afficher champ par champ
          // je stoke directement la liste envoyé par le bakend
          this.erreursChamps = err.error.details as { field: string; message: string } [];
          return;
        }
        // 400 ou 500 message generique car mon handler renvoie tjrs un message
        this.error = msg;
        this.success = '';
        // on vide pour éviter d'afficher des anciennes erreurs
        this.erreursChamps = [];

      }
    });
  }
}
