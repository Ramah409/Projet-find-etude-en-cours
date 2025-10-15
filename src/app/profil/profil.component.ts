import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profil',
  imports: [RouterLink],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  user: { email: string; role: string; } | null;


  // pour pouvoir lire l’utilisateur courant et se déconnecter.
  constructor(private auth: AuthService){
     this.user = this.auth.getUser();

  }

  // mon button que j'ai mis sur html qui va permettre a l'utilisateur de se déconnecter
  logout(): void {
    this.auth.logout();
  }

}
