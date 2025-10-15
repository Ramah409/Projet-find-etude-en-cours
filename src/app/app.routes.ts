import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { ProduitsComponent } from './produits/produits.component';
import { authGuard } from './auth.guard';
import { InscriptionComponent } from './inscription/inscription.component';
import { AdminComponent } from './admin/admin.component';
import { ProfilComponent } from './profil/profil.component';
import { roleGuard } from './role.guard';

export const routes: Routes = [
    // aller sur /accueil quand on tape juste /
    {path: '', redirectTo: 'accueil', pathMatch: 'full'},
    { path: 'accueil', component: AccueilComponent},
    { path: 'connexion', component: ConnexionComponent},
    { path: 'inscription', component: InscriptionComponent},

    // les pages qui seront protégée par le guard tant qu'on a pas accés
    // user uniquement
    { path: 'produits', component: ProduitsComponent, canActivate: [authGuard, roleGuard], data: { roles: ['USER']}}, 
    // cette partie sera accessible aux 2 juste connecté
    { path: 'profil', component: ProfilComponent, canActivate: [authGuard]},
    // admin uniquement
    { path: 'admin', component: AdminComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN']}},
    // pour renvoyer a l'accueil en cas d'erreur d'url inconnue
    { path: '**', redirectTo: 'accueil'}
];

