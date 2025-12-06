// va recupere la liste de tout mes utilisateur faire des recherche ou supprimer

import { Component, OnInit } from '@angular/core';
import { UserDto } from '../user-dto';
import { UserApiService } from '../user-api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-admin',
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
   

  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
// la liste de tout mes utilisateur récuperée depuis l'api get post ....
  users: UserDto[] = [];

  // cette partie est lié a ma barre de recherche 
  query = '';

  // les messages d'erreur qui seront afficher en cas d'erruer ou success
  error = '';
  success = '';

  // mon constructeur
  constructor(private userApi: UserApiService) {}

  // ma methode qui fait le get
  ngOnInit(): void {
      this.load();
  }

  // pour changer tous les utilisateurs get
  load(): void {
    this.userApi.getAll().subscribe({
      // en de success ca veux dire que ma requete a fonctionnée du coup ona aura tous les liste
      next: (list) => {
        // pour stoker les données dans mon tableau
        this.users = list;
        // pour effacer les erreurs 
        this.error = '';
      },
      // en cas d'erreur genre serveur ou bakend éteint
      error: (err) => {
        this.error = 'Impossible de charger les utilisateurs.';
        // pour debuguer
        console.error(err);
      }
    });
  }

  // pour filtrer les utilisateurs genre uniquement coté front
  filtered(): UserDto[] {
    // pour mettre en minuscule genre pour une recherhe insensible a la case
    const minuscule = this.query.toLowerCase().trim();

    // et si query est vide on renvoie la liste complète
    if (!minuscule) return this.users;

    // ou sinon on garde seulement ceux dont les informations contient query
    return this.users.filter(info =>
       // on retournera seulement l'utilisateur dont sont par exemple ramah
       (info.name + '' + info.email + '' + info.username).toLowerCase().includes(minuscule));
  }

  // pour supprimer un utilisateur
  onDelete(id: number): void {
    // pour demander une confirmation avant de supprimer 
    if (!confirm(`Supprimer l'utilisateur #${id} ?`)) return;

    // appel a l'API DELETE
    this.userApi.delete(id).subscribe({
      // si c'est ok
      next: () => {
        // pour retirer l'utilisateur supprimer 
        this.users = this.users.filter(liste => liste.id !== id);

        // message de success 
        this.success = `Utilisateur #${id} supprimé.`;
        this.error = '';
      }, 
      // en cas d'erreur
      error: (err) => {
        this.error = 'Suppression impossible';
        this.success = '';
        console.error(err);
      }
    });
  }
}