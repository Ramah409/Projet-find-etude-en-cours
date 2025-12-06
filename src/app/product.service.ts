import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // ses produits vont etre récuperer via l'API
  private products: Product [] = [

    new Product(1, "Brume de poche 25 ml", "Format mini avec capuchon de sécurité et jet dirigé. Discret dans une poche/sac. Usage légal, seulement en cas de nécessité.", 20, "/img3.jpg"),
    new Product(2, "Dague factice non coupante", "Objet non tranchant et non perforant, pensé pour la dissuasion visuelle uniquement. Format porte-clés, léger et discret. Pas une arme : usage responsable, privilégier l’évitement et l’alerte", 20, "/img4.jpg"),
    new Product(3, "Kubotan Grip", "Porte-clés aluminium rainuré pour une prise sûre et une mise à distance rapide. Léger, solide, facile à saisir.", 20, "/img5.jpg"),
    new Product(4, "Vaporisateur de poche 5 ml", "Atomiseur métal rechargeable, look discret. Remplissage simple, anti-fuite, se glisse partout.", 20, "/img6.jpg"),
    new Product(5, "Kit de défense multifonction", "Ensemble complet d’accessoires d’autodéfense : porte-clés, sifflet, outil de bris de vitre et plus encore. Léger, discret et pratique pour se sentir en sécurité à tout moment.", 20, "/img7.jpg"),
    new Product(6, "Alarme portable de sécurité", "Alarme sonore puissante (130 dB) pour dissuader rapidement en cas de danger. Activation simple par bouton ou tirette. Idéale pour les trajets de nuit ou les situations à risque.", 15, "/coque1.jpg"),
    new Product(7, "Coque SOS connectée", "Coque innovante avec fonction SOS. En cas d’urgence, un simple appui permet d’alerter les services d’urgence ou un contact pré-enregistré. Design sobre, adaptée à tous les styles.", 10, "/coque3.jpg" ),
    new Product(8, "Coque alarme", "Coque de protection équipée d’une alarme intégrée (130 dB) pour signaler un danger en quelques secondes. Activation rapide par bouton discret. Protège ton téléphone et ta sécurité au quotidien", 25, "/coque2.jpg"),
    new Product(9, "Sac antivol ", "Sac moderne équipé de fermetures invisibles et d’un dispositif d’alerte.", 15,"/sac1.jpg" ),
    new Product(10, "Coque sécurité rechargeable", "Coque moderne avec alarme intégrée et batterie rechargeable. Combine protection du téléphone et dispositif d’autodéfense discret.", 15, "/sac3.jpg"),
    new Product(11, "Sac à dos de sécurité intégré", "Sac pratique avec système d’alarme intégré et compartiments discrets. En cas de danger, une simple pression déclenche un signal sonore puissant. Idéal pour les trajets, le travail ou les sorties.", 20, "/sac6.jpg"),
    new Product(12, "Alarme de poche", "En un clic, elle émet un son fort et envoie une notification à un proche via Bluetooth.", 30, "/img1.jpg"),
   
   
  ];
  // pour récupere ts les produits
  getAll(): Product[]{
    return this.products;
  }

  constructor() { }
}
