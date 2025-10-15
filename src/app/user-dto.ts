// ce fichier se connectera a mon dto java
// // Requête d'inscription ce que J'ENVOIE au backend quand je crée un compte
export interface UserDto {
// ← rendre optionnel car pour un POST on ne l’a pas encore
  id?: number;          
  name: string;
  email: string;
  username: string;
  password: string;
  createdAt?: string;
}

