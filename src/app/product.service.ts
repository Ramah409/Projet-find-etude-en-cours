import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // ses produits vont etre récuperer via l'API
  private products: Product [] = [
    new Product(1, "Spray de défense", "Spray anti-agression homologué", 15, "https://i.pinimg.com/1200x/a4/02/76/a40276d733c97c7dd964dff23036b66a.jpg"),
    new Product(2, "Alarme portable", "Alarme sonore pour dissuasion rapide", 10, "https://i.pinimg.com/1200x/a4/02/76/a40276d733c97c7dd964dff23036b66a.jpg" ),
    new Product(3, "Lampe torche", "Lampe puissante avec fonction défense", 25, "https://i.pinimg.com/1200x/a4/02/76/a40276d733c97c7dd964dff23036b66a.jpg")
  ];
  // pour récupere ts les produits
  getAll(): Product[]{
    return this.products;
  }

  constructor() { }
}
