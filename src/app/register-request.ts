// Requête d'inscription : ce que le FRONT ENVOIE au BACK
export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}
