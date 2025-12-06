import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../product.model';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [
    MatIconModule, 
    CurrencyPipe,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css'
})
export class PanierComponent implements OnInit {
  // les contenu du panier
  panier: { produits: Product; quantite: number } [] = [];
  
  // ensemble des likes
  likes = new Set<number>(JSON.parse(localStorage.getItem('likes') || '[]'));

  // total du panier 
  get total(): number {
    // la somme
    return this.panier.reduce((s, it) => s + it.produits.price * it.quantite, 0);
  }
  // pour regrouper les produits 
  ngOnInit(): void {
      // tableau
      const brut: Product[] = JSON.parse(localStorage.getItem('panier') || '[]'); 
      // le regroupement
      const map = new Map<number, { produits: Product; quantite: number }>();
      // pour chaque produits
      for (const p of brut) {
        // pour les produits qui sont presents
        const x = map.get(p.id);
        // pour additionner
        x ? x.quantite++ : map.set(p.id, { produits: p, quantite: 1 });
      }
      // conversion en tableau
      this.panier = Array.from(map.values());
  }
  // pour ajouter la methode add
  add(produits: Product): void {
    const x = this.panier.find(i => i.produits.id === produits.id);
    if (x) x.quantite++;
    this.save();
  }
  // le boutton d'ajouter qui sera en unité
  removeOne(produits: Product): void {
    // ligne
    const x = this.panier.find(i => i.produits.id === produits.id);
    // si y'a rien qui est ajouter y'aura rien
    if (!x) return;
    x.quantite--;
    // la ligne sera supprimer  si y'a 0
    if (x.quantite <= 0) this.panier = this.panier.filter(i => i.produits.id !== produits.id);
    // on sauvegarde le panier
    this.save();
  }
  // pour retirer complement le panier
  removeAll(produits: Product): void {
    // je supprime la ligne
    this.panier = this.panier.filter(i => i.produits.id !== produits.id);
    this.save();
  }
  // la partie like on bascule le coeur
  toggleLike(produits: Product): void{
    // pour retirer le like
    if (this.likes.has(produits.id)){
      // sinon on ajoute le like
      this.likes.delete(produits.id);
    } else {
      this.likes.add(produits.id);
    }
    this.saveLikes();
  }
  // pour savoir si un produits est liké genre pour l'icon
  isLiked(produits: Product): boolean {
    // vrai ou faux
    return this.likes.has(produits.id);
  }
  // je sauvegarder le panier
  private save(): void {
    const plat: Product[] = this.panier.flatMap(i => Array.from({ length: i.quantite }, () => i.produits));
    localStorage.setItem('panier', JSON.stringify(plat));
  }
  // pour sauvegarder les likes
  private saveLikes(): void {
    localStorage.setItem('likes', JSON.stringify(Array.from(this.likes)));
  }
  // pour valider la commande
  confirm(): void {
    alert('commande confirmer !');
    // pour vider l'affichage
    this.panier = [];
    // pour vider le stokage
    localStorage.setItem('panier', '[]');
  }

}
