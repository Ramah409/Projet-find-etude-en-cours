import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
     RouterLink,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'projet-find-d-etude';

  // pour rendre le service public pour l'utiliser dans html
  constructor(public auth: AuthService){}
}
