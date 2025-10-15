import { Product } from './product.model';

describe('Product', () => {
  // pour tester la partie produit si on peut cree un objet 
  it('should create an instance', () => {
   
    // juste pour tester si tt fonctionne 
    const p = new Product(1, "Test", "Produit de test", 99, "https://via.placeholder.com/90");
    expect(p).toBeTruthy();
  });
});
