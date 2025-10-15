// Réponse d'auth (ce que JE REÇOIS après register/login) : token + user
export interface AuthResponse {
    // j'appel les routes qui sont protégées
    token: string;

    // information principales sur l'utilisateur genre connecté ou crée
    user: {
        // identifiant unique de base
        id: number;
        name: string;
        email: string;
        username: string;
        role: string;
        // date de creation 
         createdAt?: string;
         // message qui sera afficher apres l'inscription
         message?: string;

    }
}