import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    RouterLink,
    MatIconModule
],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.css'
 
})
export class ProduitsComponent implements OnInit{
  // les informations a saisir genre liste des produits
  products: Product[] = [];
  // texte de recherche pour un produits
  query = '';
  // message qui sera afficher en bas apres ajout du panier
  flash = '';

  constructor(
    private ps: ProductService, 
    private route: ActivatedRoute,
    private router: Router
  ){}

  // pour récuperer les produits 
  ngOnInit(): void {
    // on peut changer les produits depuis le service 
    this.products = this.ps.getAll();
  
  // pour afficher un message de bienvenue genre si on vient de la page de connexion
  const welcome = this.route.snapshot.queryParamMap.get('welcome');
  if (welcome === '1') {
    this.flash = 'Bienvenue ! Vous êtes connecté(e)';
    // le message va disparaitre apres 10 seconde
    setTimeout(() => (this.flash = ''), 10000);
  }
  }

  // pour filtrés les produits en fonction de la recherche 
  filtered(): Product[] {
    // On normalise la recherche en minuscules, et on supprime les espaces superflus
    const q = this.query.toLowerCase().trim();
    // et si le champ est vide on renvoie la liste complete
    if (!q) return this.products;
    // sinon on garde les produits
    return this.products.filter(produits => (produits.name + ' ' + produits.description).toLowerCase().includes(q));
  }

  // pour ajouter un produits  dans le panier
  addToCart(produits: Product){
    const courant: Product[] = JSON.parse(localStorage.getItem('panier') || '[]');
    // pour ajouter le produit
    courant.push(produits);
    // pour sauvegarder
    localStorage.setItem('panier', JSON.stringify(courant));
    // message qui sera afficher
    this.flash = `« ${produits.name} » Ajouté au panier.`; 
    // au bout de quelques seconde sera effacé
    setTimeout(() => (this.flash = ''), 5000);
  }
  // pour se déconnecter facilement
  logout(){
    localStorage.removeItem('demoViewRole');
    // on redirige vers la page de connexion 
    this.router.navigate(['/connexion']);
  }

}
