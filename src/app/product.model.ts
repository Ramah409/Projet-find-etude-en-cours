export class Product {

  id: number;           
  name: string;        
  description: string;  
  price: number;  
  imageUrl!: string;        

  // Pour crée facilement les produits
  constructor(id: number, name: string, description: string, price: number, imageUrl: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;

  }

}
