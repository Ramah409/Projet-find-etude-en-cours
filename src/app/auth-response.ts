// Réponse d'auth renvoyée par le backend après register/login.
export interface AuthResponse {
    // j'appel les routes qui sont protégées
    token: string;
    // information principales sur l'utilisateur connecté ou créé
    id?: number;
    name?: string;
    email?: string;
    username?: string;
    role?: string;
    // date de creation
    createdAt?: string;
    // message qui sera afficher apres l'inscription
    message?: string;
}
