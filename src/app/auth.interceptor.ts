// pour CHAQUE requête HTTP sortante, si un token existe,
// ajouter automatiquement le header "Authorization: Bearer <token>".

import { HttpErrorResponse, HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    // pour lire le token et rediriger en cas d'erreur genre si 401
    constructor(private auth: AuthService, private router: Router) {}

    // cette est appeler pour chaque requette HTTP
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // je recuprer le token depuis mon service avec la methode que je viens d'ajouter
        const token = this.auth.getToken();
        const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

        // j'envoie la requette et j'intercepte mes erreurs
        return next.handle(authReq).pipe(
            catchError((err: HttpErrorResponse) => {
                // si par exemple le bakend envoie 401 genre non autorisé on nettoie et on envoie vers connexion 
                if (err.status === 401) {
                    this.auth.logout();
                }
                return throwError(() => err);
            })
        )
    }
    
}